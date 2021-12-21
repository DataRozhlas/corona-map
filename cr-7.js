(function () {
  Highcharts.setOptions({
    lang: {
      numericSymbols: [' tis.', ' mil.', 'mld.'],
      shortWeekdays: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
      weekdays: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
    },
  });

  function parseCsv(fle) {
    const rows = fle.split('\r\n')
    const header = rows[0].split(',')
    let data = [];
    rows.slice(1,).map((row) => {
      let rw = {};
      row.split(',').map((val, i) => {
        if (!isNaN(val)) {
          val = parseFloat(val) || parseInt(val);
        }
        rw[header[i]] = val;
      })
      data.push(rw)
    })
    return data;
  }

  fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-vyleceni-umrti-testy.csv')
    .then((response) => response.text())
    .then((data) => {
      const srs = [];
      data = parseCsv(data);
      // poslednich 7 dni
      let infected = data.slice(-9).map((v) => [Date.parse(v.datum),
      parseInt(v.kumulativni_pocet_nakazenych, 10)]);
      let deceased = data.slice(-9).map((v) => [Date.parse(v.datum),
      parseInt(v.kumulativni_pocet_umrti, 10)]);

      infected = infected.map((v, i) => {
        if (i !== 0) {
          return [v[0], v[1] - infected[i - 1][1]];
        }
      });

      deceased = deceased.map((v, i) => {
        if (i !== 0) {
          return [v[0], v[1] - deceased[i - 1][1]];
        }
      });

      srs.push(
        {
          name: 'Denně zjištění nakažení',
          data: infected.slice(1),
          color: '#de2d26',
          visible: true,
          type: 'column',
        },
      );

      srs.push(
        {
          name: 'Denně zemřelí',
          data: deceased.slice(1),
          color: 'black',
          visible: true,
          type: 'column',
        },
      );

      Highcharts.chart('corona_cz_7', {
        title: {
          text: 'Počty nově zjištěných nakažených a zemřelých za týden',
          useHTML: true,
        },
        chart: {
          spacingLeft: 0,
          spacingRight: 0,
        },
        credits: {
          href: 'https://koronavirus.mzcr.cz/',
          text: 'Zdroj dat: MZ ČR',
        },
        yAxis: {
          stackLabels: {
            enabled: true,
            align: 'center',
          },
          title: {
            text: 'osoby',
          },
        },
        xAxis: {
          type: 'datetime',
          endOnTick: false,
          showLastLabel: true,
          startOnTick: false,
          labels: {
            formatter() {
              return Highcharts.dateFormat('%a %d. %m.', this.value);
            },
          },
        },
        tooltip: {
          formatter() {
            return this.points.reduce((s, point) => `${s}<br/><span style="color: ${point.series.color};">${point.series.name}</span>: ${point.y}`, `<b>${Highcharts.dateFormat('%A %d. %m.', this.x)}</b>`);
          },
          shared: true,
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
        },
        plotOptions: {
          column: {
            animation: false,
            dataLabels: {
              enabled: true,
            },
          },
          series: {
            label: {
              connectorAllowed: false,
            },
          },
        },
        series: srs,
      });
    });
}());
