(function () {
  fetch('https://data.irozhlas.cz/covid-uzis/vak_vek.json')
    .then((response) => response.json())
    .then((data) => {
      const lastDay = data.slice(-1)[0];
      const decUpd = lastDay.ind.split('-')
      delete lastDay['ind'];
      const dat = [
        {
          name: 'očkovaní',
          data: Object.values(lastDay),
        },
      ];


      Highcharts.chart('covid_vak_age', {
        chart: {
          type: 'bar',
          spacingLeft: 0,
          spacingRight: 0,
        },
        credits: {
          href: 'https://www.uzis.cz/',
          text: 'Zdroj dat: ÚZIS',
        },
        colors: ['#31a354'],
        title: {
          text: 'Věk očkovaných proti COVID-19',
          align: 'left',
          style: {
            fontWeight: 'bold',
          },
        },
        subtitle: {
          text: `Aktualizováno ${parseInt(decUpd[2])}. ${parseInt(decUpd[1])}.`,
          align: 'left',
        },
        xAxis: {
          categories: Object.keys(lastDay),
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
}());
