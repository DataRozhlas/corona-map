(
  function () {
    fetch('https://data.irozhlas.cz/covid-uzis/osoby.json')
      .then((response) => response.json())
      .then((data) => {
        const dt = [];
        const dtOld = [];
        data.data.forEach((row) => {
          const pDate = Date.parse(row.DatumHlaseni);
          const rec = dt.find((e) => e[0] === pDate);
          if (rec !== undefined) {
            rec[1] += 1;
          } else {
            dt.push([pDate, 1]);
          }
        });

        data.data.forEach((row) => {
          if (parseInt(row.Vek) >= 65) { // rizikovi dle https://www.irozhlas.cz/zpravy-domov/statistika-dusek-uzis-covid-koronavir-index-mapa-semafor_2007031702_cib
            const pDate = Date.parse(row.DatumHlaseni);
            const rec = dtOld.find((e) => e[0] === pDate);
            if (rec !== undefined) {
              rec[1] += 1;
            } else {
              dtOld.push([pDate, 1]);
            }
          }
        });

        dt.sort((a, b) => a[0] - b[0]);
        dtOld.sort((a, b) => a[0] - b[0]);

        // Highcharts.setOptions({
        //   lang: {
        //     months: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
        //     weekdays: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
        //     shortMonths: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
        //     thousandsSep: '',
        //     decimalPoint: ',',
        //     rangeSelectorZoom: 'Zobrazit',
        //   },
        //   data: { dateFormat: 'yyyy-mm-dd' },
        // });
        const chart = Highcharts.chart('corona_inf_old', {
          chart: {
            type: 'area',
          },
          credits: {
            href: 'https://koronavirus.mzcr.cz/',
            text: 'Zdroj dat: MZ ČR',
          },
          colors: ['#EB5C68'],
          title: {
            text: 'Nakažených seniorů nepřibývá',
            align: 'left',
            style: {
              fontWeight: 'bold',
            },
          },
          xAxis: {
            crosshair: true,
            type: 'datetime',
            dateTimeLabelFormats: {
              day: '%e of %b', // https://api.highcharts.com/highcharts/yAxis.dateTimeLabelFormats
            },
            plotLines: [{
              color: 'black',
              dashStyle: 'dot',
              value: Date.parse('2020-03-12'),
              width: 1.5,
              zIndex: 10000,
              label: {
                text: 'Vyhlášen nouzový stav',
                rotation: 0,
                textAlign: 'left',
                y: 20,
                align: 'left',
                style: {
                  color: '#444',
                },
              },
            }],
          },
          yAxis: {
            title: false,
            showFirstLabel: false,
            labels: {
              formatter() {
                return `${this.value}<br>osob`;
              },
            },
          },
          tooltip: {
            shared: true,
            useHTML: true,
          },
          plotOptions: {
            area: {
              label: {
                visible: false
              }
            },
            series: {
              marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
              },
              label: {
                enabled: false
              }
            },
          },
          series: [
            {
              type: 'area',
              name: 'nakažení celkem',
              data: dt,
              color: '#ddd',
              lineWidth: 0.5,
              lineColor: '#aaa',
            },
            {
              type: 'area',
              name: 'nakažení nad 65 let',
              color: '#e63946',
              lineWidth: 0.5,
              data: dtOld,
            },
          ],
        });

        chart.addAnnotation({
          labelOptions: {
            shape: 'connector',
            align: 'right',
            justify: false,
            crop: true,
            lineColor: '#f00',
            backgroundColor: '#fff'//'rgba(255,255,255,0.5)',
            // style: {
            //   fontSize: '0.8em',
            //   textOutline: '1px white',
            // },
          },
          labels: [{
            point: {
              x: chart.xAxis[0].toPixels(Date.parse('2020-06-28'), true),
              y: chart.yAxis[0].toPixels(247, true),
            },
            text: 'plošné testování<br>kontaktů horníků',
          },
          ],
        });
      });
  }());
