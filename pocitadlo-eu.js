(function() {
    const cNames = {
        'France': 'Francie',
        'Germany': 'Německo',
        'Italy': 'Itálie',
        'Austria': 'Rakousko',
        'United Kingdom': 'Spojené království',
        'Spain': 'Španělsko',
        'Poland': 'Polsko',
        'Hungary': 'Maďarsko',
        'Czech Republic': 'Česko',
        'Czechia': 'Česko',
        'Switzerland': 'Švýcarsko',
        'Russia': 'Rusko',
    }
    const colors = {
        'Francie': ['#2CB314', '#8BFA78'],
        'Německo': ['#11B35A', '#78FAB2'],
        'Itálie': ['#13B39C', '#78FAE6'] ,
        'Rakousko': ['#1394B3', '#78E0FA'],
        'Spojené království': ['#135AB3', '#78B2FA'],
        'Španělsko': ['#131AB3', '#787EFA'],
        'Polsko': ['#4C15B3', '#A578FA'],
        'Maďarsko': ['#B31477', '#FA78C8'],
        'Česko': ['#B3131E', '#FA7881'],
        'Švýcarsko': ['#dd1c77', '#df65b0'],
        'Rusko': ['#636363', '#bdbdbd'],
    }

    function ttipColor(name) {
        let idx = 0
        if (name.indexOf('mrtví') > -1) {
            idx = 1
        }
        return colors[name.split(' -')[0]][idx]
    }
    
    fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
        .then((response) => response.text())
        .then((data) => {
            const srs = []
            const stateFiltered = d3.csvParse(data).filter( v => { 
                return Object.keys(cNames).indexOf(v['Country/Region']) > -1
            })
            const summed = {}
            stateFiltered.forEach(st => {
                const cntry = st['Country/Region']
                if ( !(cntry in summed)) {
                    summed[cntry] = {}
                }
                Object.keys(st).forEach(ky => {
                    if ( !(['Country/Region', 'Lat', 'Long', 'Province/State'].includes(ky)) ) {
                        if ( !(Object.keys(summed[cntry]).includes(ky)) ) {
                            summed[cntry][ky] = 0
                        }
                        summed[cntry][ky] += parseInt(st[ky])

                    }
                })
            })

            Object.keys(summed).forEach(v => {
                const tmp = []
                Object.keys(summed[v]).forEach(day => {
                    if ( (day.indexOf('/20') > -1) & (Date.parse(day) >= 1581292800000) ) { // po 10. 2.
                        tmp.push([Date.parse(day) + 86400000, parseInt(summed[v][day])])
                    }
                })
                srs.push(
                    {
                        name: cNames[v],
                        data: tmp,
                        color: colors[cNames[v]][0],
                        visible: cNames[v] === 'Česko',
                        marker: {
                            symbol: 'circle'
                        }
                    }
                )
            })
            
            fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv')
                .then((response) => response.text())
                .then((data) => {
                    const stateFilteredDec = d3.csvParse(data).filter( v => { 
                        return Object.keys(cNames).indexOf(v['Country/Region']) > -1
                    })
                    const summedDec = {}
                    stateFilteredDec.forEach(st => {
                        const cntry = st['Country/Region']
                        if ( !(cntry in summedDec)) {
                            summedDec[cntry] = {}
                        }
                        Object.keys(st).forEach(ky => {
                            if ( !(['Country/Region', 'Lat', 'Long', 'Province/State'].includes(ky)) ) {
                                if ( !(Object.keys(summedDec[cntry]).includes(ky)) ) {
                                    summedDec[cntry][ky] = 0
                                }
                                summedDec[cntry][ky] += parseInt(st[ky])
                            }
                        })
                    })

                    Object.keys(summedDec).forEach(v => {
                        const tmpDec = []
                        Object.keys(summedDec[v]).forEach(day => {
                            if ( (day.indexOf('/20') > -1) & (Date.parse(day) >= 1581292800000) ) { // po 10. 2.
                                tmpDec.push([Date.parse(day) + 86400000, parseInt(summedDec[v][day])])
                            }
                        })
                        srs.push(
                            {
                                name: cNames[v] + ' - zesnulí',
                                data: tmpDec,
                                color: colors[cNames[v]][1],
                                linkedTo: ':previous',
                                visible: cNames[v] === 'Česko',
                                marker: {
                                    symbol: 'triangle'
                                }
                            }
                        )
                    })

                    Highcharts.chart('corona_eu', {
                        title: {
                            text: 'Zjištění nakažení a mrtví v Evropě v souvislosti s COVID-19',
                            useHTML: true
                        },
                        credits: {
                            href: 'https://github.com/CSSEGISandData/COVID-19/',
                            text: 'Zdroj dat: JHU CSSE',
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
                                    return s + `<br/><span style='color: ${ttipColor(point.series.name)};'>` + point.series.name + `</span>: ` + point.y
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



