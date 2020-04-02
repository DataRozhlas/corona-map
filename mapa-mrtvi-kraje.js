(function() {
    fetch('https://data.irozhlas.cz/covid-uzis/dead.json')
        .then((response) => response.json())
        .then((data) => {
            const tmp = {}
            data.forEach(d => {
                if (Object.keys(tmp).indexOf(d[2]) === -1) {
                    tmp[d[2]] = 0
                }
                tmp[d[2]] += 1
            })
            const dat = Object.keys(tmp).map(r => [r, tmp[r]] )

    fetch('https://data.irozhlas.cz/corona-map/kraje.json')
        .then((response) => response.json())
        .then((geojson) => {
            // relativize
            dat.forEach(f => {
                const gjs = geojson.features.filter(v => v.properties.NAZ_CZNUTS3 === f[0])[0]
                f[1] = (f[1] / gjs.properties.POCET_OB_11) * 100000
            })

            Highcharts.mapChart('corona_cz_dec_map', {
                chart: {
                    map: geojson
                },
                credits: {
                    href: 'https://koronavirus.mzcr.cz/',
                    text: 'MZ ČR',
                },
                title: {
                    text: `Zesnulí v souvislosti s COVID-19`
                },
                mapNavigation: {
                    enableMouseWheelZoom: false,
                    enabled: false,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },
                colorAxis: {
                    tickPixelInterval: 100
                },
                series: [{
                    data: dat,
                    keys: ['NAZ_CZNUTS3', 'value'],
                    joinBy: 'NAZ_CZNUTS3',
                    name: 'Zesnulí na 100 tis. obyvatel',
                    states: {
                        hover: {
                            color: '#de2d26'
                        }
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return this.NAZ_CZNUTS3 + ': ' + Math.round(this.value * 10) / 10 + ' (' + tmp[this.NAZ_CZNUTS3] + ' osob)'
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        format: '{point.properties.postal}'
                    }
                }]
            });
        })
    })
})()