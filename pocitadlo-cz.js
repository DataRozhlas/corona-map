(function() {
    fetch('https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true')
        .then((response) => response.json())
        .then((data) => {
            const srs = []

           const tested = data.numberOfTestedGraph.map(v => {
               return [Date.parse(v.date), parseInt(v.value.replace(',', ''))]
           })

           const infected = data.totalPositiveTests.map(v => {
            return [Date.parse(v.date), parseInt(v.value.replace(',', ''))]
            })

            const recovered = [[Date.parse(data.lastUpdatedAtSource), data.recovered]]
            
            srs.push(
                {
                    name: 'Testovaní',
                    data: tested,
                    color: '#3182bd',
                    visible: true,
                    marker: {
                        symbol: 'circle'
                    }
                }
            )
            
            srs.push(
                {
                    name: 'Pozitivní testy',
                    data: infected,
                    color: '#de2d26',
                    visible: true,
                    marker: {
                        symbol: 'circle'
                    }
                }
            )
            
            srs.push(
                {
                    name: 'Vyléčení',
                    data: recovered,
                    color: '#2ca25f',
                    visible: true,
                    type: 'scatter',
                    marker: {
                        symbol: 'circle'
                    }
                }
            )
            
            Highcharts.chart('corona_cz_chart', {
                title: {
                    text: `Koronavirus: testovaní (${data.totalTested}), zjištění nakažení (${data.infected}) a zotavení (${data.recovered}) v Česku`
                },
                subtitle: {
                    text: 'data: <a href="https://koronavirus.mzcr.cz/">MZ ČR</a>, <a href="https://apify.com/petrpatek/covid-cz">Apify</a>',
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
                            return s + `<br/><span style="color: ${point.series.color};">` + point.series.name + `</span>: ` + point.y
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
})()



