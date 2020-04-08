(function() {
    fetch('https://api.apify.com/v2/key-value-stores/EIolfU3CUlHlpQH5M/records/LATEST?disableRedirect=true')
        .then((response) => response.json())
        .then((data) => {
            const dat = []
            Object.values(Object.values(data.data)[Object.values(data.data).length - 1]).forEach(kraj => {
                Object.keys(kraj).forEach(kr => dat.push([kr, parseInt(kraj[kr])]))
            })
            const upDate = Object.keys(data.data)[Object.keys(data.data).length - 1].split('-')
    fetch('https://data.irozhlas.cz/corona-map/okresy.json')
        .then((response) => response.json())
        .then((geojson) => {
            // relativize
            let absDat = {}
           dat.forEach(f => {
               if (f[0] === 'Nezjištěno') { return }
                const gjs = geojson.features.filter(v => v.properties.NAZ_LAU1 === f[0])[0]
                absDat[f[0]] = f[1]
                f[1] = (f[1] / gjs.properties.POCET_OB_11) * 100000
            })

            Highcharts.mapChart('corona_okr_map', {
                chart: {
                    map: geojson
                },
                credits: {
                    href: 'https://api.apify.com/v2/key-value-stores/EIolfU3CUlHlpQH5M/records/LATEST?disableRedirect=true',
                    text: 'MZ ČR, Apify',
                },
                title: {
                    text: `Zjištění nakažení (na 100 tis. obyvatel) v okresech ČR k ${parseInt(upDate[2])}. ${parseInt(upDate[1])}.`
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
                    keys: ['NAZ_LAU1', 'value'],
                    joinBy: 'NAZ_LAU1',
                    name: 'Zjištění nakažení na 100 tis. obyvatel',
                    states: {
                        hover: {
                            color: '#de2d26'
                        }
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return this.NAZ_LAU1 + ': ' + Math.round(this.value * 10) / 10 + ' (' + absDat[this.NAZ_LAU1] + ' osob)'
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