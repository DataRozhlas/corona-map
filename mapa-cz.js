(function() {
    fetch('https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true')
        .then((response) => response.json())
        .then((data) => {
            const dat = data.infectedByRegion.map(v => {
                return [v.region, parseInt(v.value.replace(',', ''))]
            })
            const upDate = data.lastUpdatedAtSource.split('T')[0].split('-')

    fetch('./kraje.json')
        .then((response) => response.json())
        .then((geojson) => {
            // Initiate the chart
            Highcharts.mapChart('corona_cz_map', {
                chart: {
                    map: geojson
                },
                title: {
                    text: `Nakažení v krajích ČR k ${upDate[2]}. ${upDate[1]}.`
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
                    name: 'Nakažení:',
                    states: {
                        hover: {
                            color: '#a4edba'
                        }
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return this.NAZ_CZNUTS3 + ': ' + this.value
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