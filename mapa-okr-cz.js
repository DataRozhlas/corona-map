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
                    map: geojson,
                    // style: {
                    //   fontFamily: 'Asap'
                    // }
                },
                credits: {
                    href: 'https://docs.google.com/spreadsheets/d/1FFEDhS6VMWon_AWkJrf8j3XxjZ4J6UI1B2lO3IW-EEc/edit#gid=1011737151',
                    text: 'Zdroj dat: MZ ČR, Marek Lutonský',
                },
                title: {
                    text: `Zjištění nakažení (na 100 tis. obyvatel) v okresech ČR k ${parseInt(upDate[2])}. ${parseInt(upDate[1])}.`, 
                    align: 'left', 
                    style: {
                      fontWeight: 'bold'
                    }
                },
                mapNavigation: {
                    enableMouseWheelZoom: false,
                    enabled: false,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },
                colorAxis: {
                    tickPixelInterval: 100,
                    minColor: '#FDEDEE',
                    maxColor: '#DA1B2B', //e63946 CA1622
                    name: "abc"

                },
                tooltip: {
                  backgroundColor: '#ffffffee',
                  headerFormat: '<span style="margin-bottom: 0.5rem"><b>{point.NAZ_LAU1}</b></span>',
                  style: {
                    fontSize: '0.8rem',
                  }
                },
                series: [{
                    data: data.data,
                    keys: ['NAZ_LAU1', 'value'],
                    joinBy: 'NAZ_LAU1',
                    name: 'Zjištění nakažení', // na 100 tis. obyvatel
                    borderColor: '#fff',
                    states: {
                      hover: {
                          color: data,
                          borderColor: '#333',
                      }, 
                    },
                    tooltip: {
                        pointFormatter: function() {
                            return '<b>' + this.NAZ_LAU1 + '<br>' + 
                            '<b>' + Math.round(this.value * 10) / 10 + '</b> osob nakažených na 100 tisíc lidí<br>' + 
                            '<b>' + absDat[this.NAZ_LAU1] + '</b> nakažených osob celkem v okrese'
                        },
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