/* Zmeny:
    - vyhodila jsem legendu pod grafem (na telefonu zbytecne zabira misto)
    - pridala jsem popisek linky do grafu (legenda)
    - vyhodila jsem popisek y-osy (skoro zbytečný a zabírá místo) a připsala osob do labelu osy
    - vyhodila první tick label (0 osob)
    - přehodila jsem zdroj dat z subtitle do credits
    - mírně změnila barvu
*/

(function() {
    fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-vyleceni-umrti-testy.json')
        .then((response) => response.json())
        .then((dt) => {
           const current = dt.data.map(v => {
               return [Date.parse(v.datum), v.kumulovany_pocet_nakazenych - v.kumulovany_pocet_vylecenych - v.kumulovany_pocet_umrti]
           })     
           console.log(document.getElementById('corona_cz_akt'), document.getElementById('corona_cz_akt').offsetWidth)
          //  let czActHeight = document.getElementById('corona_cz_act').width() * 0.75
            let chartWidth = document.getElementById('corona_cz_akt').offsetWidth;
            if (chartWidth < 400) {
              chartHeight = chartWidth * 0.8
            } else if (chartWidth < 500) {
              chartHeight = chartWidth * 0.6
            } else if (chartWidth < 600) {
              chartHeight = chartWidth * 0.5
            } else if (chartWidth < 800) {
              chartHeight = chartWidth * 0.45
            } else (
              chartHeight = chartWidth * 0.4
            )
            // let czActHeight = document.getElementById('corona_cz_akt').offsetWidth * 0.6
            
            Highcharts.chart('corona_cz_akt', {
                chart: {
                  height: chartHeight
                },
                title: {
                    text: `Aktuálně zjištění nemocní COVID-19 v Česku (bez vyléčených a zemřelých)`, 
                    align: 'left', 
                    style: {
                      fontWeight: 'bold'
                    }
                },
                subtitle: {
                    // text: 'data: <a href="https://koronavirus.mzcr.cz/">MZ ČR</a>',
                    // useHTML: true
                },
                credits: {
                  href: 'https://koronavirus.mzcr.cz/',
                  text: 'Zdroj dat: MZ ČR',
                },
                yAxis: {
                  title: false,
                  showFirstLabel: false,
                    // title: {
                    //     text: 'počet osob'
                    // },
                    endOnTick: false,
                    labels: {
                      formatter: function () {
                        return this.value + '<br>osob';
                      }
                    }
                },
                xAxis: {
                    type: 'datetime',
                    startOnTick: false,
                    endOnTick: false,
                    showLastLabel: true,
                    // startOnTick: true,
                    // min: Highcharts.dateFormat('2020-01-20'),
                    labels:{
                        formatter: function(){
                            return Highcharts.dateFormat('%d. %m.', this.value);
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#ffffffee',
                    formatter: function () {
                        const dat = dt.data.find(v => Date.parse(v.datum) === this.x)
                        const prev = dt.data.filter(v => Date.parse(v.datum) < this.x)
                        let prevDpct = '?'
                        try {
                            const prevD = prev[prev.length - 1].kumulovany_pocet_nakazenych - prev[prev.length - 1].kumulovany_pocet_vylecenych - prev[prev.length - 1].kumulovany_pocet_umrti
                            prevDpct = Math.round((1 - (prevD / this.y)) * 1000) / 10
                        } catch(err) {}
                        
                        return `<b>${ Highcharts.dateFormat('%d. %m.', this.x)}</b>
                        <br><b><span style="color:#de2d26">Aktuální nemocní: ${this.y}</span></b> (denní nárůst: ${prevDpct} %)
                        <br>Vyléčení: ${dat.kumulovany_pocet_vylecenych || 0}
                        <br>Zemřelí: ${dat.kumulovany_pocet_umrti || 0}`
                    },
                    useHTML: true
                },
                legend: false,
                // legend: {
                //     layout: 'horizontal',
                //     align: 'center',
                //     verticalAlign: 'bottom'
                // },
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
                series: [
                    {
                        name: 'Aktuálně nemocní',
                        data: current,
                        color: '#e63946', //de2d26
                        visible: true,
                        marker: {
                            symbol: 'circle'
                        }
                    }
                ]
            });
    })
})()



