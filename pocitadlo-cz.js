(function() {
    fetch('https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            const srs = []

           const tested = data.numberOfTestedGraph.map(v => {
               return parseInt(v.value.replace(',', ''))
           })

           const dtes = data.numberOfTestedGraph.map(v => {
            return parseInt(Date.parse(v.date))
        })

           const infected = data.totalPositiveTests.map(v => {
            return parseInt(v.value.replace(',', ''))
            })

            
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
            
            Highcharts.chart('corona_cz_chart', {
                title: {
                    text: `Koronavirus: testovaní (${data.totalTested}) a nakažení (${data.infected}) v Česku`
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
                    type: 'category',
                    categories: dtes,

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



