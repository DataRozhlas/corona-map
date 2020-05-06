(function() {
    fetch('https://data.irozhlas.cz/covid-uzis/osoby.json')
        .then((response) => response.json())
        .then((data) => {
            const tSeries = {}
            const dtes = {}
            for (var i = Date.parse('2020-02-29'); i <= parseInt(Date.now()); i += 86400000) {
                dtes[i] = 0
            }

            data.forEach(rec => {
                if ( !(tSeries.hasOwnProperty(rec.KHS)) ) {
                    tSeries[rec.KHS] = JSON.parse(JSON.stringify(dtes))
                }
                tSeries[rec.KHS][Date.parse(rec.DatumHlaseni)] += 1
            })

            const dat = []
            function add(a, b) {
                return a + b
            }
            Object.keys(tSeries).forEach(muniID => {
                const tmp = Object.values(tSeries[muniID])
                dat.push([ muniID, tmp.slice(-5).reduce(add, 0) / 5 ]) // prumer za 5 dni
            })

            const upDate = data[data.length - 1].DatumHlaseni.split('-')

    fetch('./kraje.json')
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
                    text: `Půměrně noví zjištění nakažení (za 5 dní, na 100 tis. obyvatel) v krajích ČR k ${parseInt(upDate[2])}. ${parseInt(upDate[1])}.`
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
                    name: 'Půměrní noví nakažení na 100 tis. obyvatel',
                    states: {
                        hover: {
                            color: '#de2d26'
                        }
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return this.NAZ_CZNUTS3 + ': ' + Math.round(this.value * 10) / 10 + ' (' + absDat[this.KOD_CZNUTS3] + ' osob)'
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