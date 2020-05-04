(function() {
    fetch('https://data.irozhlas.cz/covid-uzis/osoby.json')
        .then((response) => response.json())
        .then((data) => {
            const tSeries = {}

            data.forEach(rec => {
                if ( !(tSeries.hasOwnProperty(rec.KHS)) ) {
                    tSeries[rec.KHS] = 0
                }
                tSeries[rec.KHS] += 1
            })

            const dat = []
            Object.keys(tSeries).forEach(muniID => {
                dat.push([muniID, tSeries[muniID]])
            })

            const upDate = data[data.length - 1].DatumHlaseni.split('-')

    fetch('https://data.irozhlas.cz/corona-map/kraje.json')
        .then((response) => response.json())
        .then((geojson) => {
            // relativize
            let absDat = {}
           dat.forEach(f => {
                const gjs = geojson.features.find(v => v.properties.KOD_CZNUTS3 === f[0])
                absDat[f[0]] = f[1]
                f[1] = (f[1] / gjs.properties.POCET_OB_11) * 100000
            })
            Highcharts.mapChart('corona_cz_map', {
                chart: {
                    map: geojson
                },
                credits: {
                    href: 'https://onemocneni-aktualne.mzcr.cz/api/v1/covid-19',
                    text: 'MZ ČR',
                },
                title: {
                    text: `Zjištění nakažení (na 100 tis. obyvatel) v krajích ČR k ${parseInt(upDate[2])}. ${parseInt(upDate[1])}.`
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
                    keys: ['KOD_CZNUTS3', 'value'],
                    joinBy: 'KOD_CZNUTS3',
                    name: 'Zjištění nakažení na 100 tis. obyvatel',
                    states: {
                        hover: {
                            color: '#de2d26'
                        }
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return this.properties.NAZ_CZNUTS3 + ': ' + Math.round(this.value * 10) / 10 + ' (' + absDat[this.KOD_CZNUTS3] + ' osob)'
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