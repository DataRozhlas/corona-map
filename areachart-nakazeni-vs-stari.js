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
         
              function getDate() {
                return Date.parse('2020-01-12')
              }

              Highcharts.setOptions({
                lang: {
                    months: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
                    weekdays: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
                    shortMonths: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
                    thousandsSep: '',
                    decimalPoint:',',
                    rangeSelectorZoom: 'Zobrazit'
                },
                data: { dateFormat: 'yyyy-mm-dd' },
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
                  text: 'Zdroj dat: MZ ČR',
                },
                colors: ['#EB5C68'], //edae49
                title: {
                    text: 'Nakažených seniorů nepřibývá', 
                    align: 'left', 
                    style: {
                      fontWeight: 'bold'
                    }
                },
                subtitle: {
                    text: 'a to je dobře',
                    align: 'left', 
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
                  title: false, 
                  showFirstLabel: false,
                  labels: {
                    formatter: function () {
                      return this.value + '<br>osob';
                    }
                  }
                },
                annotations: [{
                  labelOptions: {
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      // verticalAlign: 'top',
                      // y: 15,
                      // align: 'right',
                      // justify: false,
                      // crop: false,
                      style: {
                          fontSize: '0.8em',
                          textOutline: '1px white'
                      }
                  },
                  labels: [{
                      point: {
                          // xAxis: Date.parse('2020-01-12'),
                          // yAxis: 0,
                          x: Date.parse('2020-04-12'),
                          y: 200
                      },
                      // x: 20,
                      // y: -20,
                      text: 'Lorem ipsum'
                  }
                ]
              }],
                tooltip: {
                    formatter: function() {
                        return `Dne ${Highcharts.dateFormat('%e. %m.', this.x)} se nakazilo <b>${this.y}</b> osob ve věku 65+ let`
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
                        color: '#ddd',
                        lineWidth: 0.5,
                        lineColor: '#aaa'
                        // color: 'blue'
                    },
                    {
                      type: 'area',
                      name: 'nakažení nad 65 let',
                      color: '#e63946', //EB5C68
                      lineWidth: 0.5,

                      data: dtOld
                    },
                  ]
            })
      })
  })()