(function() {
    fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-vyleceni-umrti-testy.json')
        .then((response) => response.json())
        .then((data) => {
            const srs = []

            const tested = data.data.map(v => {
                return [Date.parse(v.datum), parseInt(v.kumulovany_pocet_provedenych_testu)]
            })

            const infected = data.data.map(v => {
                return [Date.parse(v.datum), parseInt(v.kumulovany_pocet_nakazenych)]
            })

            const recovered = [[Date.parse(data.data[data.data.length - 1].datum), data.data[data.data.length - 1].kumulovany_pocet_vylecenych]]
            
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
                    text: `Koronavirus: testy (${data.data[data.data.length - 1].kumulovany_pocet_provedenych_testu}), pozitivně testovaní (${data.data[data.data.length - 1].kumulovany_pocet_nakazenych}) a zotavení (${data.data[data.data.length - 1].kumulovany_pocet_vylecenych}) v Česku`
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
                        text: 'počet testů'
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



