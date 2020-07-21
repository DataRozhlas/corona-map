(
  function() { 
      fetch('https://data.irozhlas.cz/covid-uzis/osoby.json')
          .then((response) => response.json())
          .then((data) => {
              const dt = []
              const dtOld = []
              data.data.forEach(row => {
                const pDate = Date.parse(row.DatumHlaseni)
                let rec = dt.find(e => e[0] === pDate)
                if (rec !== undefined) {
                    rec[1] += 1
                } else {
                    dt.push([pDate, 1])
                }
              })

              data.data.forEach(row => {
                if (parseInt(row.Vek) >= 65) { //rizikovi dle https://www.irozhlas.cz/zpravy-domov/statistika-dusek-uzis-covid-koronavir-index-mapa-semafor_2007031702_cib
                    const pDate = Date.parse(row.DatumHlaseni)
                    let rec = dtOld.find(e => e[0] === pDate)
                    if (rec !== undefined) {
                        rec[1] += 1
                    } else {
                        dtOld.push([pDate, 1])
                    }
                }
              })

              dt.sort( (a, b) => {
                  return a[0] - b[0]
              })

              dtOld.sort( (a, b) => {
                return a[0] - b[0]
                })
         
                
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
              Highcharts.chart('corona_inf_old', {
                chart: {
                    type: 'area',
                    // style: {
                    //   fontFamily: 'Asap'
                    // }
                },
                credits: {
                  href: 'https://koronavirus.mzcr.cz/',
                  text: 'MZ ČR',
                },
                colors: ['#EB5C68'], //edae49
                title: {
                    text: 'Nakažených seniorů nepřibývá'
                },
                subtitle: {
                    text: 'a to je dobře'
                },
                xAxis: {
                    crosshair: true,
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%e of %b' //https://api.highcharts.com/highcharts/yAxis.dateTimeLabelFormats
                    },
                    plotLines: [{
                      color: 'black',
                      dashStyle: 'dot',
                      value: Date.parse('2020-03-12'),
                      width: 1.5,
                      zIndex: 10000,
                      label: {
                        text: 'Vyhlášen nouzový stav',
                        rotation: 0,
                        textAlign: 'left',
                        y: 20,
                        align: 'left',
                        style: {
                          color: '#444',
                          // fontWeight: 'bold',
                        }
                      }
                    }],
                },
                yAxis: {
                    //type: 'logarithmic',
                    title: {
                        text: 'počet osob'
                    }
                },
              //   annotations: [{
              //     labelOptions: {
              //         backgroundColor: 'rgba(255,255,255,0.5)',
              //         verticalAlign: 'top',
              //         y: 15,
              //         align: 'right',
              //         justify: false,
              //         crop: false,
              //         style: {
              //             fontSize: '0.8em',
              //             textOutline: '1px white'
              //         }
              //     },
              //     labels: [{
              //         point: {
              //             xAxis: 0,
              //             yAxis: 0,
              //             // x: 0,
              //             // y: 1.4
              //         },
              //         // x: 20,
              //         // y: -20,
              //         text: 'První úsek pro cyklisty:<br/>cyklostezka kolem Svratky<br/>z Komína na přehradu'
              //     }
              //   ]
              // }],
                tooltip: {
                    formatter: function() {
                        return `Dne ${new Date(this.x).toUTCString()} se nakazilo <b>${this.y}</b> osob ve věku 65+ let`
                    },
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                  series: {
                    marker: {
                      enabled: false,
                      symbol: 'circle',
                      radius: 2
                    }
                  }
                },
                series: [
                    {
                        type: 'area',
                        name: 'nakažení celkem',
                        data: dt,
                        color: '#d1d1d1',
                        lineWidth: 1,
                        // color: 'blue'
                    },
                    {
                      type: 'area',
                      name: 'nakažení nad 65 let',
                      color: '#EB5C68',
                      data: dtOld
                    },
                  ]
            })
      })
  })()