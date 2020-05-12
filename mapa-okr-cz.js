(function() {
    fetch('https://data.irozhlas.cz/covid-uzis/okresy.json')
        .then((response) => response.json())
        .then((data) => {
            const upDate = data.upd.split('-')
    fetch('https://data.irozhlas.cz/corona-map/okresy.json')
        .then((response) => response.json())
        .then((geojson) => {
            // relativize
            let absDat = {}
           data.data.forEach(f => {
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
                    href: 'https://docs.google.com/spreadsheets/d/1FFEDhS6VMWon_AWkJrf8j3XxjZ4J6UI1B2lO3IW-EEc/edit#gid=1011737151',
                    text: 'MZ ČR, Marek Lutonský',
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
                    data: data.data,
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