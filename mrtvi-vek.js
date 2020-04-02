(function() {
  fetch('https://data.irozhlas.cz/covid-uzis/osoby.json')
        .then((response) => response.json())
        .then((dt) => {
          incTmp = {
            '0–49': 0,
            '50–59': 0,
            '60+': 0
          }

          dt.forEach(val => {
            const age = parseInt(val.Vek)
            if (age < 50) {
              incTmp['0–49'] += 1
            } else if (age > 59) {
              incTmp['60+'] += 1
            } else {
              incTmp['50–59'] += 1
            }
          })

    fetch('https://data.irozhlas.cz/covid-uzis/dead.json')
        .then((response) => response.json())
        .then((data) => {
            const tmp = {}
            data.forEach(d => {
                if (Object.keys(tmp).indexOf(d[1]) === -1) {
                    tmp[d[1]] = 0
                }
                tmp[d[1]] += 1
            })

            const dat = [
              {
                name: 'nakažení',
                data: [
                  incTmp['0–49'],
                  incTmp['50–59'],
                  incTmp['60+']
                ]
              },
              {
                name: 'zesnulí',
                data: [
                  tmp['0–49'],
                  tmp['50–59'],
                  tmp['60+']
                ]
              }
            ]
          
            Highcharts.chart('corona_cz_dec_age', {
              chart: {
                  type: 'column'
              },
              credits: {
                href: 'https://koronavirus.mzcr.cz/',
                text: 'MZ ČR',
              },
              colors: ['#de2d26', 'black'],
              title: {
                  text: 'Věk nakažených a zesnulých v Česku v souvislosti s COVID-19'
              },
              xAxis: {
                  categories: [ '0-49', '50-59', '60+' ],
                  crosshair: true
              },
              yAxis: {
                  //type: 'logarithmic',
                  title: {
                      text: 'počet osob'
                  }
              },
              tooltip: {
                  headerFormat: '<span style="font-size:10px"><b>Věk {point.key}</b></span><table>',
                  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                      '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
              },
              plotOptions: {
                  column: {
                      pointPadding: 0.2,
                      borderWidth: 0
                  }
              },
              series: dat
          });

    })
  })
})()