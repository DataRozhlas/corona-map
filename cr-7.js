(function () {
  Highcharts.setOptions({
    lang: {
      numericSymbols: [' tis.', ' mil.', 'mld.'] //otherwise by default ['k', 'M', 'G', 'T', 'P', 'E']
    }
  });

  fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-vyleceni-umrti-testy.json')
    .then((response) => response.json())
    .then((data) => {
      const srs = [];

      // poslednich 7 dni
      let infected = data.data.slice(-8).map((v) => [Date.parse(v.datum),
        parseInt(v.kumulovany_pocet_nakazenych, 10)]);
      let deceased = data.data.slice(-8).map((v) => [Date.parse(v.datum),
        parseInt(v.kumulovany_pocet_umrti, 10)]);

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
          yAxis: 0,
        },
      );

      srs.push(
        {
          name: 'Denně zemřelírtví',
          data: deceased.slice(1),
          color: 'black',
          visible: true,
          type: 'column',
          yAxis: 1,
        },
      );

      Highcharts.chart('corona_cz_7', {
        title: {
          text: 'Počty nově zjištěných nakažených a zemřelých za 7 dní',
          useHTML: true,
        },
        subtitle: {
          text: 'pro srovnání má počet nakažených osu vlevo, počet zemřelých vpravo',
        },
        credits: {
          href: 'https://koronavirus.mzcr.cz/',
          text: 'Zdroj dat: MZ ČR',
        },
        yAxis: [{
          title: {
            text: 'nakažení',
          },
        }, {
          title: {
            text: 'mrtví',
          },
          opposite: true,
        }],
        xAxis: {
          type: 'datetime',
          endOnTick: true,
          showLastLabel: true,
          startOnTick: true,
          labels: {
            formatter() {
              return Highcharts.dateFormat('%d. %m.', this.value);
            },
          },
        },
        tooltip: {
          formatter() {
            return this.points.reduce((s, point) => `${s}<br/><span style="color: ${point.series.color};">${point.series.name}</span>: ${point.y}`, `<b>${Highcharts.dateFormat('%d. %m.', this.x)}</b>`);
          },
          shared: true,
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
        },
        plotOptions: {
          line: {
            animation: false,
            marker: {
              enabled: false,
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
