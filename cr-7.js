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

  Promise.all([
    fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-vyleceni-umrti-testy.csv').then((d) => d.text()), 
    fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-reinfekce.csv').then((d) => d.text()),
  ]).then((res) => {
      const data = parseCsv(res[0]);
      const rei = parseCsv(res[1])

      const srs = [];
      // poslednich 7 dni
      let infected = rei.slice(-10).map((v) => [Date.parse(v.datum), (v.nove_pripady || 0) + (v.nove_reinfekce || 0)]);
      let deceased = data.slice(-9).map((v) => [Date.parse(v.datum), v.prirustkovy_pocet_umrti]);

      srs.push(
        {
          name: 'Denně zjištění nakažení',
          data: infected.slice(0,8),
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
