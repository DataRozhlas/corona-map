(function () {
  fetch('https://data.irozhlas.cz/covid-uzis/okresy.json')
    .then((response) => response.json())
    .then((data) => {
      const upDate = data.upd.split('-');
      fetch('https://data.irozhlas.cz/corona-map/okresy.json')
        .then((response) => response.json())
        .then((geojson) => {
          const mapDat = [];
          data.data.forEach((f) => {
            const gjs = geojson.features.filter((v) => v.properties.LAU1 === f[0])[0];
            if (gjs === undefined) { return; }
            mapDat.push([f[0], ((f[1] - f[2] - f[3]) / gjs.properties.OBAKT) * 100000]);
          });

          Highcharts.mapChart('corona_okr_map', {
            chart: {
              map: geojson,
              spacingLeft: 0,
              spacingRight: 0,
            },
            credits: {
              href: 'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19',
              text: 'Zdroj dat: MZ ČR',
            },
            title: {
              text: `Aktuálně nemocní (na 100 tis. obyvatel) v okresech ČR k ${parseInt(upDate[2])}. ${parseInt(upDate[1])}.`,
              useHTML: true,
            },
            subtitle: {
              text: 'aktualizace jednou týdně',
            },
            mapNavigation: {
              enableMouseWheelZoom: false,
              enabled: false,
              buttonOptions: {
                verticalAlign: 'bottom',
              },
            },
            colorAxis: {
              tickPixelInterval: 100,
              minColor: '#FDEDEE',
              maxColor: '#DA1B2B', // e63946 CA1622
              name: 'abc',

            },
            tooltip: {
              backgroundColor: '#ffffffee',
              headerFormat: '<span style="margin-bottom: 0.5rem"><b>{point.NAZ_LAU1}</b></span>',
              style: {
                fontSize: '0.8rem',
              },
            },
            series: [{
              data: mapDat,
              keys: ['LAU1', 'value'],
              joinBy: 'LAU1',
              name: 'Aktuálně nemocní', // na 100 tis. obyvatel
              borderColor: '#fff',
              states: {
                hover: {
                  color: data,
                  borderColor: '#333',
                },
              },
              tooltip: {
                pointFormatter() {
                  const rec = data.data.find((v) => v[0] === this.LAU1);
                  const nazok = geojson.features.find((v) => v.properties.LAU1 === this.LAU1);
                  return `<b>${nazok.properties.NAZOK}<br>`
                            + `aktuálně <b>${Math.round(this.value * 10) / 10}</b> osob nemocných na 100 tisíc obyvatel<br>`
                            + `za dobu epidemie celkem ${rec[1]} nemocných, ${rec[2]} vyléčených a ${rec[3]} mrtvých`;
                },
              },
              dataLabels: {
                enabled: false,
                format: '{point.properties.postal}',
              },
            }],
          });
        });
    });
}());
