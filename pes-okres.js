(function () {
  function stage(points) {
    if (points <= 20) { return 1; }
    if (points <= 40) { return 2; }
    if (points <= 60) { return 3; }
    if (points <= 75) { return 4; }
    if (points >= 76) { return 5; }
  }

  fetch('https://data.irozhlas.cz/covid-uzis/pes_okresy.json')
    .then((response) => response.json())
    .then((data) => {
      const upDate = data.upd.split('-');
      fetch('https://data.irozhlas.cz/corona-map/okresy.json')
        .then((response) => response.json())
        .then((geojson) => {
          const mapDat = [];
          data.data.forEach((f) => {
            mapDat.push([f.okres_kod, f.body]);
          });

          Highcharts.mapChart('covid_pes', {
            chart: {
              map: geojson,
              spacingLeft: 0,
              spacingRight: 0,
            },
            credits: {
              href: 'https://onemocneni-aktualne.mzcr.cz/pes',
              text: 'Zdroj dat: MZ ČR',
            },
            title: {
              text: `Úroveň rizika PES dle okresů k ${parseInt(upDate[2])}. ${parseInt(upDate[1])}.`,
              useHTML: true,
            },
            subtitle: {
              text: '<a target="_blank" href="https://onemocneni-aktualne.mzcr.cz/pes">Co znamenají jednotlivé barvy?</a>',
              useHTML: true,
            },
            mapNavigation: {
              enableMouseWheelZoom: false,
              enabled: false,
              buttonOptions: {
                verticalAlign: 'bottom',
              },
            },
            tooltip: {
              backgroundColor: '#ffffffee',
              headerFormat: '<span style="margin-bottom: 0.5rem"><b>{point.NAZ_LAU1}</b></span>',
              style: {
                fontSize: '0.8rem',
              },
            },
            colors: [
              '#31a354',
              '#fed976',
              '#f16913',
              '#de2d26',
              '#756bb1',
            ],
            colorAxis: {
              dataClassColor: 'category',
              dataClasses: [{
                to: 20,
              }, {
                from: 21,
                to: 40,
              }, {
                from: 41,
                to: 60,
              }, {
                from: 61,
                to: 75,
              }, {
                from: 76,
              }],
            },
            series: [{
              data: mapDat,
              keys: ['LAU1', 'value'],
              joinBy: 'LAU1',
              name: 'PES index',
              borderColor: '#fff',
              states: {
                hover: {
                  color: data,
                  borderColor: '#333',
                },
              },
              tooltip: {
                pointFormatter() {
                  const rec = data.data.find((v) => v.okres_kod === this.LAU1);
                  const nazok = geojson.features
                    .find((v) => v.properties.LAU1 === rec.okres_kod);
                  return `<b>${nazok.properties.NAZOK}<br>` + `Úroveň rizika: ${stage(rec.body)} (${rec.body} bodů)`;
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
