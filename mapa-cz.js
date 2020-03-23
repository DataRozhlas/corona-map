(function() {
    fetch('https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true')
        .then((response) => response.json())
        .then((data) => {
            const dat = data.infectedByRegion.map(v => {
                return [v.name, parseInt(v.value)]
            })
            const upDate = data.lastUpdatedAtSource.split('T')[0].split('-')

    fetch('https://data.irozhlas.cz/corona-map/kraje.json')
        .then((response) => response.json())
        .then((geojson) => {
            // relativize
           dat.forEach(f => {
                const gjs = geojson.features.filter(v => v.properties.NAZ_CZNUTS3 === f[0])[0]
                f[1] = (f[1] / gjs.properties.POCET_OB_11) * 100000
            })

            Highcharts.mapChart('corona_cz_map', {
                chart: {
                    map: geojson
                },
                credits: {
                    href: 'https://apify.com/petrpatek/covid-cz',
                    text: 'MZ ČR, Apify',
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
                    keys: ['NAZ_CZNUTS3', 'value'],
                    joinBy: 'NAZ_CZNUTS3',
                    name: 'Zjištění nakažení na 100 tis. obyvatel',
                    states: {
                        hover: {
                            color: '#de2d26'
                        }
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return this.NAZ_CZNUTS3 + ': ' + Math.round(this.value * 10) / 10
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