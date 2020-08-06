(function() {
    const cNames = {
        'USA': 'Spojené státy',
    }
    const colors = {
        'Spojené státy': ['#2CB314', '#8BFA78'],
    }

    function ttipColor(name) {
        let idx = 0
        if (name.indexOf('mrtví') > -1) {
            idx = 1
        }
        return colors[name.split(' -')[0]][idx]
    }
    
    fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv')
        .then((response) => response.text())
        .then((data) => {
            const srs = []
            const summed = {}
            const d = d3.csvParse(data)
            d.forEach(row => {
                Object.keys(row).forEach(key => {
                    //if key not in summed, add
                    if ( (!(Object.keys(summed).includes(key))) & (key.includes('/20')) ) {
                        summed[key] = 0
                    }
                    if ( key.includes('/20') ) {
                        summed[key] += parseInt(row[key])
                    }
                })
            })
            const tmp = []
            Object.keys(summed).forEach(day => {
                tmp.push( [Date.parse(day), summed[day]])   
            })
            srs.push(
                {
                    name: 'USA - nakažení',
                    data: tmp,
                    color: '#756bb1',
                    visible: true,
                    marker: {
                        symbol: 'circle'
                    }
                }
            )

            
            fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv')
                .then((response) => response.text())
                .then((data) => {
                        const dDec = d3.csvParse(data)
                        summedDec = {}
                        dDec.forEach(row => {
                            Object.keys(row).forEach(key => {
                                //if key not in summed, add
                                if ( (!(Object.keys(summedDec).includes(key))) & (key.includes('/20')) ) {
                                    summedDec[key] = 0
                                }
                                if ( key.includes('/20') ) {
                                    summedDec[key] += parseInt(row[key])
                                }
                            })
                        })
                        const tmpDec = []
                        Object.keys(summedDec).forEach(day => {
                            tmpDec.push( [Date.parse(day), summedDec[day]])   
                        })
                        srs.push(
                            {
                                name: 'USA - zesnulí',
                                data: tmpDec,
                                color: '#de2d26',
                                visible: true,
                                marker: {
                                    symbol: 'circle'
                                }
                            }
                        )

                    Highcharts.chart('corona_usa', {
                        title: {
                            text: 'Zjištění nakažení a mrtví v USA v souvislosti s COVID-19',
                            useHTML: true
                        },
                        // subtitle: {
                        //     text: 'data: <a href="https://github.com/CSSEGISandData/COVID-19/">JHU CSSE</a>',
                        //     useHTML: true
                        // },
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
                                    return s + `<br/><span style='color: ${point.series.color};'>` + point.series.name + `</span>: ` + point.y
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
                        series: srs
                    });
                })
    })
})()



