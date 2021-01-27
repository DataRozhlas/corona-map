(function () {
  fetch('https://data.irozhlas.cz/covid-uzis/vak_kraje.json')
    .then((response) => response.json())
    .then((data) => {
      const lastDay = data.slice(-1)[0];
      const decUpd = lastDay.ind.split('-');
      const tmp = [];

      data.forEach((row) => {
        const ind = Date.parse(row.ind);
        delete row.ind;
        tmp.push([ind, Object.values(row).reduce((a, b) => a + b, 0)]);
      });

      const tmp_7day = [];

      Highcharts.setOptions({
        lang: {
          numericSymbols: [' tis.', ' mil.'],
          weekdays: ['pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota', 'neděle'],
        },
      });

      Highcharts.chart('covid_vak_speed', {
        chart: {
          type: 'line',
          spacingLeft: 0,
          spacingRight: 0,
        },
        credits: {
          href: 'https://onemocneni-aktualne.mzcr.cz/vakcinace-cr',
          text: 'Zdroj dat: ÚZIS',
        },
        title: {
          text: 'Denní počet vakcín',
          align: 'left',
          style: {
            fontWeight: 'bold',
          },
        },
        subtitle: {
          text: `Aktualizováno ${parseInt(decUpd[2])}. ${parseInt(decUpd[1])}. <i>(Čísla mohou být zpožděná.)</i>`,
          align: 'left',
          useHTML: true,
        },
        xAxis: {
          type: 'datetime',
          tickInterval: 7 * 24 * 3600 * 1000,
          dateTimeLabelFormats: {
            week: '%d. %m.',
          },
        },
        yAxis: {
          title: {
            text: 'počet vakcín',
          },
        },
        tooltip: {
          useHTML: true,
          dateTimeLabelFormats: {
            day: '%A %d. %m.',
          },
          style: {
            fontSize: '0.8rem',
          },
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false,
            },
          },
        },
        series: [{
          name: 'očkování',
          data: tmp,
          color: '#de2d26',
        }, {
          name: 'týdenní průměr',
          data: tmp_7day,
          color: '#756bb1',
        }],
      });
    });
}());
