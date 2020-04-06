(function() {
    function unfuckUZISdate(fuckery) {
        const shitcocks = fuckery.split('.')
        return Date.parse(shitcocks[2] + '-' + shitcocks[1] + '-' + shitcocks[0])
    }

    fetch('https://data.irozhlas.cz/covid-uzis/nakaza.json')
        .then((response) => response.json())
        .then((nakaza) => {
            
            fetch('https://data.irozhlas.cz/covid-uzis/testy.json')
                .then((response) => response.json())
                .then((testy) => {
                    const srs = []
                    let infected = nakaza.map(v => {
                        return [Date.parse(v.datum), parseInt(v.pocetCelkem)]
                    })
        
                    let tested = testy.data.map(v => {
                        return [unfuckUZISdate(v.datum), parseInt(v['testy-celkem'])]
                    })
        
                    infected = infected.filter(v => v[0] > 1584316800000) // od 16. 3.
                    tested = tested.filter(v => v[0] > 1584316800000)

                    console.log(tested)

                    let pctDiff = []
                    infected.forEach( (v, ind) => {
                        if (ind <= 1) { return }
                        const diff = ( (v[1] - infected[ind - 1][1]) / infected[ind - 1][1] ) * 100
                        if ( (diff !== Infinity) & !(isNaN(diff)) ) {
                            pctDiff.push([v[0],  diff])
                        }
                    })

                    let pctTstDiff = []
                    tested.forEach( (v, ind) => {
                        if (ind <= 1) { return }
                        const diff = ( (v[1] - tested[ind - 1][1]) / tested[ind - 1][1] ) * 100
                        if ( (diff !== Infinity) & !(isNaN(diff)) ) {
                            pctTstDiff.push([v[0],  diff])
                        }
                    })
                    
                    srs.push(
                        {
                            name: 'Nárůst nakažených',
                            data: pctDiff,
                            color: '#de2d26',
                            visible: true,
                            marker: {
                                symbol: 'circle'
                            }
                        }
                    )

                    srs.push(
                        {
                            name: 'Přírůst testů',
                            data: pctTstDiff,
                            color: '#3182bd',
                            visible: true,
                            marker: {
                                symbol: 'circle'
                            }
                        }
                    )
                    
                    Highcharts.chart('corona_cr_pct', {
                        title: {
                            text: `Procentuální nárůst testů a zjištěných nakažených COVID-19 v Česku (oproti předchozímu dni)`,
                            useHTML: true,
                        },
                        subtitle: {
                            text: 'data: <a href="https://koronavirus.mzcr.cz/">MZ ČR</a>',
                            useHTML: true
                        },
                        credits: {
                            enabled: false,
                        },
                        yAxis: {
                            title: {
                                text: 'nárůst v %'
                            }
                        },
                        xAxis: {
                            type: 'datetime',
                            endOnTick: true,
                            showLastLabel: true,
                            startOnTick: true,
                            labels:{
                                formatter: function(){
                                    return Highcharts.dateFormat('%d. %m.', this.value);
                                }
                            }
                        },
                        tooltip: {
                            formatter: function () {
                                return this.points.reduce(function (s, point) {
                                    return s + `<br/><span style="color: ${point.series.color};">${point.series.name}:` + (Math.round(point.y * 10) / 10).toFixed(1) + ' %'
                                }, '<b>' +  Highcharts.dateFormat('%d. %m.', this.x) + '</b>');
                            },
                            shared: true,
                            useHTML: true,
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
