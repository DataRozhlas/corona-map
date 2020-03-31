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
        "Switzerland": "Švýcarsko",
        "Netherlands": "Nizozemí",
        "Czech Republic": "Česko",
        "Czechia": "Česko",
        "Japan": "Japonsko",
        "US": "USA",
        "Australia": "Austrálie",
        "Republic of Korea": "Korejská republika",
        "Korea, South": "Jižní Korea",
        "Taiwan*": "Taiwan",
        "Singapore": "Singapur",
        "Hong Kong": "Hong Kong",
    }
    
    fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
        .then((response) => response.text())
        .then((data) => {
            const cleaned = d3.csvParse(data).map(row => {
                let cntry = row['Country/Region']
                if (row['Province/State'] === 'Hong Kong') { // HK separe od Ciny
                    cntry = 'Hong Kong'
                }
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
                colors: ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#b15928', '#8dd3c7','black','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5'],
                title: {
                    text: 'Zjištění nakažení COVID-19'
                },
                subtitle: {
                    text: 'po dnech od 100. zjištěného nakaženého, nakažení na <a href="https://cs.wikipedia.org/wiki/Logaritmick%C3%A1_stupnice">logaritmické stupnici</a>, data: <a href="https://github.com/CSSEGISandData/COVID-19/">JHU CSSE</a>',
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



