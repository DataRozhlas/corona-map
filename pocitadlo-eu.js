(function() {
    const cNames = {
        "France": "Francie",
        "Germany": "Německo",
        "Italy": "Itálie",
        "Austria": "Rakousko",
        "UK": "Spojené království",
        "Spain": "Španělsko",
        "Poland": "Polsko",
        "Slovakia": "Slovensko",
        "Hungary": "Maďarsko",
        "Czech Republic": "Česko",
    }
    const colors = {
        "Francie": ['#2CB314', '#8BFA78'],
        "Německo": ['#11B35A', '#78FAB2'],
        "Itálie": ['#13B39C', '#78FAE6'] ,
        "Rakousko": ['#1394B3', '#78E0FA'],
        "Spojené království": ['#135AB3', '#78B2FA'],
        "Španělsko": ['#131AB3', '#787EFA'],
        "Polsko": ['#4C15B3', '#A578FA'],
        "Slovensko": ['#8B13B3', '#D978FA'],
        "Maďarsko": ['#B31477', '#FA78C8'],
        "Česko": ['#B3131E', '#FA7881'],
    }

    function ttipColor(name) {
        let idx = 0
        if (name.indexOf('mrtví') > -1) {
            idx = 1
        }
        return colors[name.split(' -')[0]][idx]
    }
    
    fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv')
        .then((response) => response.text())
        .then((data) => {
            const srs = []
            d3.csvParse(data).filter( v => { 
                return Object.keys(cNames).indexOf(v['Country/Region']) > -1
            }).forEach(v => {
                const tmp = []
                Object.keys(v).forEach(day => {
                    if ( (day.indexOf('/20') > -1) & (Date.parse(day) >= 1581292800000) ) { // po 10. 2.
                        tmp.push([Date.parse(day) + 86400000, parseInt(v[day])])
                    }
                })
                srs.push(
                    {
                        name: cNames[v['Country/Region']],
                        data: tmp,
                        color: colors[cNames[v['Country/Region']]][0],
                        visible: cNames[v['Country/Region']] == 'Česko',
                        marker: {
                            symbol: 'circle'
                        }
                    }
                )
            })
            
            fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv')
                .then((response) => response.text())
                .then((data) => {
                    d3.csvParse(data).filter( v => {
                        return Object.keys(cNames).indexOf(v['Country/Region']) > -1
                    }).forEach(v => {
                        const tmp = []
                        Object.keys(v).forEach(day => {
                            if ( (day.indexOf('/20') > -1) & (Date.parse(day) >= 1581292800000) ) { // po 10. 2.
                                tmp.push([Date.parse(day) + 86400000, parseInt(v[day])])
                            }
                        })
                        srs.push(
                            {
                                name: cNames[v['Country/Region']] + ' - mrtví',
                                data: tmp,
                                color: colors[cNames[v['Country/Region']]][1],
                                linkedTo: ':previous',
                                visible: cNames[v['Country/Region']] == 'Česko',
                                marker: {
                                    symbol: 'triangle'
                                }
                            }
                        )
                    })

                    Highcharts.chart('corona_eu', {
                        title: {
                            text: 'Nakažení a mrtví v EU v souvislosti s COVID-19'
                        },
                        subtitle: {
                            text: 'data: <a href="https://github.com/CSSEGISandData/COVID-19/">JHU CSSE</a>',
                            useHTML: true
                        },
                        credits: {
                            enabled: false,
                        },
                        yAxis: {
                            title: {
                                text: 'počet osob'
                            }
                        },
                        xAxis: {
                            type: 'datetime',
                            labels:{
                                formatter: function(){
                                    return Highcharts.dateFormat('%d. %m.', this.value);
                                }
                             }
                        },
                        tooltip: {
                            formatter: function () {
                                return this.points.reduce(function (s, point) {
                                    return s + `<br/><span style="color: ${ttipColor(point.series.name)};">` + point.series.name + `</span>: ` + point.y
                                }, '<b>' +  Highcharts.dateFormat('%d. %m.', this.x) + '</b>');
                            },
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
                        series: srs.sort((a, b) => a.name.localeCompare(b.name))
                    });
                })
    })
})()



