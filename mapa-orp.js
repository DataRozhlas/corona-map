(function () {
  fetch('https://data.irozhlas.cz/covid-uzis/orp.json')
    .then((response) => response.json())
    .then((data) => {
      const upDate = data.upd.split('-');
      fetch('https://data.irozhlas.cz/corona-map/orp.json')
        .then((response) => response.json())
        .then((geojson) => {
          const mapDat = [];
          data.data.forEach((f) => {
            const gjs = geojson.features.filter((v) => v.properties.KOD === f[0])[0];
            mapDat.push([f[0], (f[1] / gjs.properties.POCET_OBYV) * 1000]);
          });

          Highcharts.mapChart('corona_orp_map', {
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
              text: `Nově nemocní za 7 dní v obcích s rozšířenou působností k ${parseInt(upDate[2], 10)}. ${parseInt(upDate[1], 10)}.`,
              useHTML: true,
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
            legend: {
              enabled: false,
            },
            series: [{
              data: mapDat,
              keys: ['KOD', 'value'],
              joinBy: 'KOD',
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
                  const rec = data.data.find((v) => v[0] === this.KOD);
                  const nazok = geojson.features.find((v) => v.properties.KOD === this.KOD);
                  return `<b>${nazok.properties.NAZ_ORP}<br>`
                            + `týdně <b>${rec[1]}</b> nově nemocných (<b>${Math.round(this.value * 10) / 10}</b> na tis. obyv.)<br>`
                            + `<b>${rec[2] + rec[3]}</b> ve věku 65 let a více<br>`
                            + `<b>${rec[7]}</b> aktuálně hospitalizovaných`;
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
