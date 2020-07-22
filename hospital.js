/* eslint-disable no-undef */
// eslint-disable-next-line func-names
(function () {
  const systemCapacity = 1679;
  fetch('https://data.irozhlas.cz/covid-uzis/hospital.json')
    .then((response) => response.json())
    .then((data) => {
      const srs = [];
      srs.push({
        name: 'Hospitalizovaní',
        data: data.map((v) => [Date.parse(v.date), parseInt(v.hospital, 5)]),
        color: '#fc9272',
        visible: true,
        marker: {
          symbol: 'circle',
        },
      });

      srs.push(
        {
          name: 'Těžce nemocní',
          data: data.map((v) => [Date.parse(v.date), parseInt(v.tezke, 5)]),
          color: '#de2d26',
          visible: true,
          marker: {
            symbol: 'circle',
          },
        },
      );

      srs.push(
        {
          name: 'Kapacita péče o těžce nemocné',
          data: data.map((v) => [Date.parse(v.date), systemCapacity]),
          dashStyle: 'longdash',
          color: 'black',
          visible: true,
          marker: {
            symbol: 'circle',
          },
        },
      );

      Highcharts.chart('corona_hospital', {
        title: {
          text: 'Počet hospitalizovaných a těžce nemocných v ČR v souvislosti s COVID-19',
          useHTML: true,
        },
        subtitle: {
          text: 'data: <a href="https://koronavirus.mzcr.cz/">MZ ČR</a>',
          useHTML: true,
        },
        credits: {
          enabled: false,
        },
        yAxis: {
          title: {
            text: 'počet nemocných',
          },
        },
        xAxis: {
          type: 'datetime',
          endOnTick: false,
          showLastLabel: false,
          startOnTick: false,
          labels: {
            formatter() {
              return Highcharts.dateFormat('%d. %m.', this.value);
            },
          },
        },
        tooltip: {
          formatter() {
            return this.points.reduce((s, point) => `${s}<br/><span style="color: ${point.series.color};">${point.series.name}: ${point.y}`, `<b>${Highcharts.dateFormat('%d. %m.', this.x)}</b>`);
          },
          shared: true,
          useHTML: true,
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
