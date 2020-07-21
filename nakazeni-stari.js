(function() { 
      fetch('https://data.irozhlas.cz/covid-uzis/osoby.json')
          .then((response) => response.json())
          .then((data) => {
              console.log(data.data)

              const dt = []
              data.data.forEach(row => {
                  if (parseInt(row.Vek) >= 65) { //rizikovi dle https://www.irozhlas.cz/zpravy-domov/statistika-dusek-uzis-covid-koronavir-index-mapa-semafor_2007031702_cib
                    const pDate = Date.parse(row.DatumHlaseni)
                    let rec = dt.find(e => e[0] === pDate)
                    if (rec !== undefined) {
                        rec[1] += 1
                    } else {
                        dt.push([pDate, 1])
                    }
                  }
              })

              dt.sort( (a, b) => {
                  return a[0] - b[0]
              })
         
              Highcharts.chart('corona_inf_old', {
                chart: {
                    type: 'line'
                },
                credits: {
                  href: 'https://koronavirus.mzcr.cz/',
                  text: 'MZ ČR',
                },
                colors: ['#de2d26'],
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
                    }
                },
                yAxis: {
                    //type: 'logarithmic',
                    title: {
                        text: 'počet osob'
                    }
                },
                tooltip: {
                    formatter: function() {
                        return `Dne ${new Date(this.x).toUTCString()} se nakazilo <b>${this.y}</b> osob ve věku 65+ let`
                    },
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [
                    {
                      name: 'nakažení',
                      data: dt
                    }
                  ]
            })
      })
  })()