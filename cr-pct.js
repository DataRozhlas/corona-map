(function() {
    fetch('https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true')
        .then((response) => response.json())
        .then((data) => {
            const srs = []

            let infected = data.totalPositiveTests.map(v => {
                return [Date.parse(v.date), parseInt(v.value)]
            })

            let tested = data.numberOfTestedGraph.map(v => {
                return [Date.parse(v.date), parseInt(v.value)]
            })

            infected = infected.filter(v => v[0] > 1583020800000) // od 1. 3.
            tested = tested.filter(v => v[0] > 1583020800000)

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
                    name: 'Přírůst testovaných',
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
                    text: `Procentuální nárůst testovaných a zjištěných nakažených COVID-19 v Česku (oproti předchozímu dni)`,
                    useHTML: true,
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
})()
