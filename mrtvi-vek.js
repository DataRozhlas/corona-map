(function () {
  fetch('https://data.irozhlas.cz/covid-uzis/osoby.json')
    .then((response) => response.json())
    .then((dt) => {
      const incTmp = dt.data;

      fetch('https://data.irozhlas.cz/covid-uzis/dead_age.json')
        .then((response) => response.json())
        .then((data) => {
          const dat = [
            {
              name: 'nakažení',
              data: Object.values(incTmp),
            },
            {
              name: 'zesnulí',
              data: Object.values(data.data),
            },
          ];

          const decUpd = data.upd.replace(' 2020', '');

          Highcharts.chart('corona_cz_dec_age', {
            chart: {
              type: 'bar',
              spacingLeft: 0,
              spacingRight: 0,
            },
            credits: {
              href: 'https://koronavirus.mzcr.cz/',
              text: 'Zdroj dat: MZ ČR',
            },
            colors: ['#e63946', '#003d5b'],
            title: {
              text: 'Věk nakažených a zesnulých v Česku v souvislosti s COVID-19',
              align: 'left',
              style: {
                fontWeight: 'bold',
              },
            },
            subtitle: {
              text: 'Počet úmrtí aktualizován ' + decUpd,
              align: 'left',
            },
            xAxis: {
              categories: Object.keys(incTmp),
              crosshair: true,
            },
            yAxis: {
              title: {
                text: 'počet osob',
              },
            },
            tooltip: {
              backgroundColor: '#ffffffee',
              headerFormat: '<span style="font-size:0.8rem"><b>Věk {point.key}</b></span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
                      + '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true,
              style: {
                fontSize: '0.8rem',
              },
            },
            plotOptions: {
              series: {
                pointWidth: 15,
                borderWidth: 0,
                borderRadius: 2,
              },
            },
            series: dat,
          });
        });
    });
}());
