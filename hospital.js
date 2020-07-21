(function() {
    const systemCapacity = 1679
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
                    lineWidth: 0.5,
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
                    color: '#e63946', //de2d26
                    visible: true,
                    lineWidth: 0.5,
                    marker: {
                        symbol: 'circle'
                    }
                }
            )

            // srs.push(
            //     {
            //         name: 'Kapacita péče o těžce nemocné',
            //         data: data.map(v => {
            //             return [Date.parse(v.date), systemCapacity]
            //         }),
            //         dashStyle: 'longdash',
            //         color: 'black',
            //         visible: true,
            //         marker: {
            //             symbol: 'circle'
            //         }
            //     }
            // )
            Highcharts.setOptions({
              lang: {
                  months: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
                  weekdays: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
                  shortMonths: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
                  thousandsSep: '',
                  decimalPoint:',',
                  rangeSelectorZoom: 'Zobrazit'
              }
            });
            Highcharts.chart('corona_hospital', {
                chart: {
                  type: 'area'
                },
                title: {
                    text: `Počet hospitalizovaných a těžce nemocných v ČR v souvislosti s COVID-19`,
                    // useHTML: true, 
                    align: 'left', 
                    style: {
                      fontWeight: 'bold'
                    }
                },
                subtitle: {
                    text: 'Rozhodně máme ještě dost místa, hh',
                    align: 'left', 
                },
                credits: {
                  href: 'https://koronavirus.mzcr.cz/',
                  text: 'Zdroj dat: MZ ČR',
                },
                yAxis: {
                    title: {
                        text: 'počet nemocných'
                    },
                    max: 1700,
                    plotLines: [{
                      color: 'black',
                      dashStyle: 'dot',
                      value: 1679,
                      width: 1.5,
                      zIndex: 10000,
                      label: {
                        text: 'Kapacita péče o těžce nemocné',
                        rotation: 0,
                        textAlign: 'left',
                        y: -5,
                        align: 'left',
                        style: {
                          color: '#444',
                          fontWeight: 'bold',
                        }
                      }
                    }],
                    plotBands: [{
                      color: '#f2f2f2',
                      from: 0,
                      to: 1679,
                      label: {
                        // text: 'Kapacita péče o těžce nemocné', //Období s nejvyššími<br>teplotami v roce
                        style: {
                          color: '#444'
            
                        }
                      }
                    }]
                },
                xAxis: {
                    type: 'datetime',
                    endOnTick: true,
                    showLastLabel: true,
                    startOnTick: true,
                    // labels:{
                    //     formatter: function(){
                    //         return Highcharts.dateFormat('%d. %m.', this.value);
                    //     }
                    // },
                    dateTimeLabelFormats: {
                      day: '%e of %b' //https://api.highcharts.com/highcharts/yAxis.dateTimeLabelFormats
                  },
                },
                tooltip: {
                    formatter: function () {
                        return this.points.reduce(function (s, point) {
                            return s + `<br/><span style="color: ${point.series.color};">${point.series.name}: ${point.y}`
                        }, '<b>' +  Highcharts.dateFormat('%e. %b', this.x) + '</b>');
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
                    area: {
                        animation: false,
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2
                        },
                    },
                    series: {
                        label: {
                            enabled:false,
                            // style: {
                            //   color: 'pink'
                            // },
                            connectorAllowed: false //false
                        },

                    }
                },
                series: srs
            })
        })
})()
