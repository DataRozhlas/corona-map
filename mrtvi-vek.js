(function() {
  fetch('https://data.irozhlas.cz/covid-uzis/osoby.json')
        .then((response) => response.json())
        .then((dt) => {
          incTmp = {
            '0-14': 0,
            '15-24': 0,
            '25-34': 0,
            '35-44': 0,
            '45-54': 0,
            '55-64': 0,
            '65-74': 0,
            '75-84': 0,
            '85+': 0,
          }

          dt.data.forEach(val => {
            const age = parseInt(val.Vek)
            if (age >= 85) {
              incTmp['85+'] += 1
            } else {
              Object.keys(incTmp).forEach(inter => {
                const from = parseInt(inter.split('-')[0])
                const to = parseInt(inter.split('-')[1])
                if ( (age >= from) & (age <= to) ) {
                  incTmp[inter] += 1
                }
              })
            }
          })

    fetch('https://data.irozhlas.cz/covid-uzis/dead_age.json')
        .then((response) => response.json())
        .then((data) => {
            const dat = [
              {
                name: 'nakažení',
                data: Object.values(incTmp)
              },
              {
                name: 'zesnulí',
                data: Object.values(data)
              }
            ]
          
            Highcharts.chart('corona_cz_dec_age', {
              chart: {
                  type: 'bar',
                  // style: {
                  //   fontFamily: 'Asap'
                  // }
              },
              credits: {
                href: 'https://koronavirus.mzcr.cz/',
                text: 'Zdroj dat: MZ ČR',
              },
              // colors: visColors, //['#de2d26', 'black'],
              colors: [ '#e63946', '#003d5b' ],
              // colors: [ '#edae49', '#d1495b'],
              title: {
                  text: 'Věk nakažených a zesnulých v Česku v souvislosti s COVID-19', 
                  align: 'left', 
                  style: {
                    fontWeight: 'bold'
                  }
              },
              xAxis: {
                  categories: Object.keys(incTmp),
                  crosshair: true
              },
              yAxis: {
                  //type: 'logarithmic',
                  title: {
                      text: 'počet osob'
                  }
              },
              tooltip: {
                  backgroundColor: '#ffffffee',
                  headerFormat: '<span style="font-size:0.8rem"><b>Věk {point.key}</b></span><table>',
                  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                      '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true,
                  style: {
                    fontSize: '0.8rem'
                  }
              },
              plotOptions: {
                  series: {
                      pointWidth: 15,
                      // pointPadding: 0.5,
                      // groupPadding: 1 ,
                      borderWidth: 0,
                      borderRadius: 2,
                      // color: visColors
                  }
              },
              series: dat
          });

    })
  })
})()