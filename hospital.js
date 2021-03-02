(function () {
  fetch('https://data.irozhlas.cz/covid-uzis/nemocnice_kapacity.json')
    .then((response) => response.json())
    .then((data) => {
      data = data.filter((r) => Date.parse(r.datum) >= 1604188800000);
      const srs = [];
      srs.push(
        {
          name: 'Volná místa na JIP (covid)',
          data: data.map((v) => [Date.parse(v.datum), parseInt(v.jip)]),
          color: '#fc9272',
          visible: true,
          lineWidth: 0.5,
          marker: {
            symbol: 'circle',
          },
        },
      );

      srs.push(
        {
          name: 'Volná lůžka s kyslíkem (covid)',
          data: data.map((v) => [Date.parse(v.datum), parseInt(v.kyslik)]),
          color: '#e63946',
          visible: true,
          lineWidth: 0.5,
          marker: {
            symbol: 'circle',
          },
        },
      );

      Highcharts.setOptions({
        lang: {
          months: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
          weekdays: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
          shortMonths: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
          thousandsSep: '',
          numericSymbols: [' tis.', ' mil.', 'mld.', 'T', 'P', 'E'],
          decimalPoint: ',',
          rangeSelectorZoom: 'Zobrazit',
        },
      });
      Highcharts.chart('corona_hospital', {
        chart: {
          type: 'line',
          spacingLeft: 0,
          spacingRight: 0,
        },
        title: {
          text: 'Volná místa pro pacienty s covid-19',
          align: 'left',
          style: {
            fontWeight: 'bold',
          },
        },
        credits: {
          href: 'https://koronavirus.mzcr.cz/',
          text: 'Zdroj dat: MZ ČR',
        },
        yAxis: {
          title: {
            text: 'volná místa',
          },
          // max: 1700,,
          plotBands: [{
            color: '#f2f2f2',
            from: 0,
            to: 3942,
            label: {
              style: {
                color: '#444',

              },
            },
          }],
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
          area: {
            animation: false,
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2,
            },
          },
          series: {
            label: {
              enabled: false,
              connectorAllowed: false,
            },

          },
        },
        series: srs,
      });
    });
}());
