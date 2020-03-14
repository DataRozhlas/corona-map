(function() {
    const cNames = {
        'France': "Francie",
        "Germany": "Německo",
        'China': 'Čína',
        "Italy": "Itálie",
        "Austria": "Rakousko",
        "UK": "Spojené království",
        "Spain": "Španělsko",
        "Poland": "Polsko",
        "Slovakia": "Slovensko",
        "Hungary": "Maďarsko",
        "Czech Republic": "Česko",
        "Czechia": "Česko",
        "Japan": "Japonsko",
        "US": "USA",
        "Australia": "Austrálie",
        "Republic of Korea": "Korejská republika",
        "Korea, South": "Jižní Korea",
        "Taiwan*": "Taiwan",
    }
    
    fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv')
        .then((response) => response.text())
        .then((data) => {
            const cleaned = d3.csvParse(data).map(row => {
                let cntry = row['Country/Region']
                delete row['Lat']
                delete row['Long']
                delete row['Province/State']
                delete row['Country/Region']
                return [cntry, Object.values(row).map(val => parseInt(val))]
            })
            let dta = {}
            cleaned.forEach(row => {
                if (Object.keys(dta).indexOf(row[0]) === -1) {
                    dta[row[0]] = row[1]
                } else {
                    dta[row[0]] = dta[row[0]].map( (num, idx) => {
                        return num + row[1][idx]
                     })
                }
            })

            function fromHunFilter(arr) { //bereme od 100. nakaženého
                let max = 0
                let out = []
                arr.forEach(v => {
                    if (v > max) {
                        max = v
                    }
                    if (max < 100) {
                        
                    } else {
                        out.push(v)
                    }
                })
                return out
            }

            let srs = []
            Object.keys(dta).forEach(key => {
                if ( (Object.keys(cNames).indexOf(key) === -1) | (fromHunFilter(dta[key]).length === 0) ) { return }
                srs.push({
                    name: cNames[key],
                    data: fromHunFilter(dta[key]),
                    visible: true,
                    marker: {
                        symbol: 'circle'
                    }
                })
            })

            Highcharts.chart('corona_log', {
                title: {
                    text: 'Nakažení COVID-19'
                },
                subtitle: {
                    text: 'po dnech od 100. nakaženého, nakažení na <a href="https://cs.wikipedia.org/wiki/Logaritmick%C3%A1_stupnice">logaritmické stupnici</a>, data: <a href="https://github.com/CSSEGISandData/COVID-19/">JHU CSSE</a>',
                    useHTML: true
                },
                credits: {
                    enabled: false,
                },
                yAxis: {
                    type: 'logarithmic',
                    title: {
                        text: 'počet osob'
                    }
                },
                xAxis: {
                    allowDecimals: false,
                    labels:{
                        formatter: function() {
                            return this.pos + '. den'
                        }
                     }
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 10px">{point.key}. den</span><br/>',
                    shared: true
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                plotOptions: {
                    line: {
                        animation: false,
                        marker: {
                            enabled: false
                        },
                    },
                    series: {
                        label: {
                            connectorAllowed: false
                        }
                    }
                },
                series: srs
            });
    })
})()



