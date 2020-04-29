(function() {
    fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-vyleceni-umrti-testy.json')
        .then((response) => response.json())
        .then((data) => {
            const srs = []

           const infected = data.data.map(v => {
            return [Date.parse(v.datum), parseInt(v.kumulovany_pocet_nakazenych)]
            })

            let rZero = []
            infected.forEach( (v, ind) => {
                if (ind <= 4) { return }
                const r0 = v[1] / infected[ind - 4][1]
                if ( (r0 !== Infinity) & !(isNaN(r0)) ) {
                    rZero.push([v[0],  r0])
                }
                
            })
            
            srs.push(
                {
                    name: 'R<sub>0</sub>',
                    data: rZero,
                    color: '#de2d26',
                    visible: true,
                    marker: {
                        symbol: 'circle'
                    }
                }
            )
            
            Highcharts.chart('r_whatever', {
                title: {
                    text: `Odhad čísla R<sub>0</sub> v Česku: ${(Math.round(rZero[rZero.length - 1][1] * 10) / 10).toFixed(1)}`,
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
                        text: 'podíl nakažených jedním nemocným'
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
                            return s + `<br/><span style="color: ${point.series.color};">Odhadované R<sub>0</sub></span>: ` + (Math.round(point.y * 10) / 10).toFixed(1)
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
})()



