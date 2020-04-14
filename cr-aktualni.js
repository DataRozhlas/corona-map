(function() {
    fetch('https://data.irozhlas.cz/covid-uzis/current.json')
        .then((response) => response.json())
        .then((data) => {
           const current = data.map(v => {
               return [Date.parse(v.date), v.inf - v.recov - v.dec]
           })            
            
            Highcharts.chart('corona_cz_akt', {
                title: {
                    text: `Aktuálně zjištění nemocní COVID-19 v Česku (bez vyléčených a zemřelých)`
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
                        const dat = data.find(v => Date.parse(v.date) === this.x)
                        const prev = data.filter(v => Date.parse(v.date) < this.x)
                        let prevDpct = '?'
                        try {
                            const prevD = prev[prev.length - 1].inf - prev[prev.length - 1].recov - prev[prev.length - 1].dec
                            prevDpct = Math.round((1 - (prevD / this.y)) * 1000) / 10
                        } catch(err) {}
                        
                        return `<b>${ Highcharts.dateFormat('%d. %m.', this.x)}</b>
                        <br>Aktuální nemocní: ${this.y} (denní nárůst: ${prevDpct} %)
                        <br>Vyléčení: ${dat.recov || 0}
                        <br>Zemřelí: ${dat.dec || 0}`
                    },
                    useHTML: true
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
                series: [
                    {
                        name: 'Aktuálně nemocní',
                        data: current,
                        color: '#de2d26',
                        visible: true,
                        marker: {
                            symbol: 'circle'
                        }
                    }
                ]
            });
    })
})()



