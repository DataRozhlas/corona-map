(function () {
  fetch('https://data.irozhlas.cz/covid-uzis/vak_kraje.json')
    .then((response) => response.json())
    .then((data) => {
      const lastDay = data.slice(-1)[0];
      const decUpd = lastDay.ind.split('-');
      const muni = {};

      data.forEach((m) => {
        Object.keys(m).forEach((key) => {
          if (!(key in muni)) {
            muni[key] = [];
          }
          muni[key].push(m[key]);
        });
      });

      // kumulativní graf
      Object.keys(muni).forEach((key) => {
        if (key === 'ind') { return; }
        const cumSum = ((sum) => value => sum += value)(0);
        muni[key] = muni[key].map(cumSum);
      });

      const dat = [];
      Object.keys(muni).forEach((key) => {
        if (key === 'ind') { /* pass */ } else {
          dat.push({
            name: key,
            data: muni[key],
          });
        }
      });
      const days = muni.ind.map((d) => {
        const p = d.split('T')[0].split('-');
        return `${p[2]}. ${p[1]}.`;
      });

      Highcharts.setOptions({
        lang: {
          numericSymbols: [' tis.', ' mil.'],
        },
      });

      Highcharts.chart('covid_vak_mun', {
        chart: {
          type: 'area',
          spacingLeft: 0,
          spacingRight: 0,
        },
        credits: {
          href: 'https://www.uzis.cz/',
          text: 'Zdroj dat: ÚZIS',
        },
        colors: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', 'lightgray', '#b15928', 'black', '#01665e', '#542788'],
        title: {
          text: 'Celkem očkovaní v krajích',
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
          categories: days,
          crosshair: true,
        },
        yAxis: {
          title: {
            text: 'počet osob',
          },
        },
        tooltip: {
          backgroundColor: '#ffffffee',
          headerFormat: '<span style="font-size:0.8rem"><b>Celkem ke dni {point.key}</b></span><table>',
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
          area: {
            stacking: 'normal',
            marker: {
              enabled: false,
            },
          },
        },
        series: dat,
      });
    });
}());
