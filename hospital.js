(function() {
    const systemCapacity = 823
    fetch('https://data.irozhlas.cz/covid-uzis/hospital.json')
        .then((response) => response.json())
        .then((data) => {
            srs = []
            srs.push(
                {
                    name: 'Hospitalizovaní',
                    data: data.map(v => {
                        return [Date.parse(v.date), parseInt(v.hospital)]
                    }),
                    color: '#fc9272',
                    visible: true,
                    marker: {
                        symbol: 'circle'
                    }
                }
            )

            srs.push(
                {
                    name: 'Těžce nemocní',
                    data: data.map(v => {
                        return [Date.parse(v.date), parseInt(v.tezke)]
                    }),
                    color: '#de2d26',
                    visible: true,
                    marker: {
                        symbol: 'circle'
                    }
                }
            )

            srs.push(
                {
                    name: 'Kapacita péče o těžce nemocné',
                    data: data.map(v => {
                        return [Date.parse(v.date), systemCapacity]
                    }),
                    dashStyle: 'longdash',
                    color: 'black',
                    visible: true,
                    marker: {
                        symbol: 'circle'
                    }
                }
            )

            Highcharts.chart('corona_cr_pct', {
                title: {
                    text: `Počet hsopitalizovaných a těžce nemocných v ČR v souvislosti s COVID-19`,
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
                        text: 'počet nemocných'
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
                            return s + `<br/><span style="color: ${point.series.color};">${point.series.name}: ${point.y}`
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
            })
        })
})()
