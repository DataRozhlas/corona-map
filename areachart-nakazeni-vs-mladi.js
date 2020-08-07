(function () {
  fetch("https://data.irozhlas.cz/covid-uzis/osoby.json")
    .then((response) => response.json())
    .then((data) => {
      const dt = [];
      const dtYoung = [];
      const ratioYoung = [];
      const others = [];
      const slideAvg = [];
      data.data.forEach((row) => {
        const pDate = Date.parse(row.DatumHlaseni);
        let rec = dt.find((e) => e[0] === pDate);
        if (rec !== undefined) {
          rec[1] += 1;
        } else {
          dt.push([pDate, 1]);
        }
      });


      // get # of people younger than 25 (sum per day)
      data.data.forEach((row) => {
        if (parseInt(row.Vek) < 15) {
          //rizikovi dle https://www.irozhlas.cz/zpravy-domov/statistika-dusek-uzis-covid-koronavir-index-mapa-semafor_2007031702_cib
          const pDate = Date.parse(row.DatumHlaseni);
          let rec = dtYoung.find((e) => e[0] === pDate);
          if (rec !== undefined) {
            rec[1] += 1;
          } else {
            dtYoung.push([pDate, 1]);
          }
        }
      });

      dt.sort((a, b) => {
        return a[0] - b[0];
      });

      dtYoung.sort((a, b) => {
        return a[0] - b[0];
      });


      // compute relative number of young infected
      dtYoung.forEach((d) => {
        let totRec = dt.find((e) => e[0] === d[0]);
        if (totRec) {
          let ratio = (d[1] / totRec[1]) * 100;
          ratioYoung.push([d[0], ratio]);
          others.push([d[0], 100 - ratio]);
        }
      });

      // get 5 day average
      for (let i = 2; i < ratioYoung.length - 2; i++) {
        slideAvg.push([
          ratioYoung[i][0],
          (ratioYoung[i - 2][1] +
            ratioYoung[i - 1][1] +
            ratioYoung[i][1] +
            ratioYoung[i + 1][1] +
            ratioYoung[i + 2][1]) /
            5,
        ]);
      }

      function getDate() {
        return Date.parse("2020-01-12");
      }

      Highcharts.chart("corona_ratio_young_abs", {
        chart: {
          type: "area",
        },
        credits: {
          href: "https://koronavirus.mzcr.cz/",
          text: "Zdroj dat: MZ ČR",
        },
        colors: ["#EB5C68"], //edae49
        title: {
          text: "Mladých nakažených pozvolně přibývá",
          useHTML: true
        },
        subtitle: {
          text: "nárůst zaznamenává skupina 24 až 35 let"
          + '<br><span style="color: #fff">.</span>',
          useHTML: true
        },
        xAxis: {
          crosshair: true,
          type: "datetime",
          dateTimeLabelFormats: {
            day: "%e of %b", //https://api.highcharts.com/highcharts/yAxis.dateTimeLabelFormats
          },
          plotLines: [
            {
              color: "black",
              dashStyle: "dot",
              value: Date.parse("2020-03-12"),
              width: 1.5,
              zIndex: 10000,
              label: {
                text: "Vyhlášen nouzový stav",
                rotation: 0,
                textAlign: "left",
                y: 20,
                align: "left",
                style: {
                  color: "#444",
                  // fontWeight: 'bold',
                },
              },
            },
          ],
        },
        yAxis: {
          title: false,
          showFirstLabel: false,
          labels: {
            formatter: function () {
              return this.value + "<br>osob";
            },
          },
        },
        tooltip: {
          formatter: function () {
            return `Dne ${Highcharts.dateFormat(
              "%e. %m.",
              this.x
            )} se nakazilo <b>${this.y}</b> osob ve věku 65+ let`;
          },
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          series: {
            marker: {
              enabled: false,
              symbol: "circle",
              radius: 2,
            },
          },
        },
        series: [
          {
            type: "area",
            name: "nakažení celkem",
            data: dt,
            color: "#ddd",
            lineWidth: 0.5,
            lineColor: "#aaa",
            // color: 'blue'
          },
          {
            type: "area",
            name: "nakažení nad 65 let",
            color: "#e63946", //EB5C68
            lineWidth: 0.5,

            data: dtYoung,
          },
        ],
      });

      Highcharts.chart("corona_ratio_young_rel", {
        chart: {
          type: "area",
        },
        title: {
          text: "Poměr nakažených mladých ze všech nakažených",
          useHTML: true,
        },
        subtitle: {
          text: "24-35 let?" + '<br><span style="color: #fff">.</span>',
          useHTML: true,
        },
        credits: {
          href: "https://koronavirus.mzcr.cz/",
          text: "Zdroj dat: MZ ČR",
        },
        xAxis: {
          crosshair: true,
          type: "datetime",
          dateTimeLabelFormats: {
            day: "%e of %b", //https://api.highcharts.com/highcharts/yAxis.dateTimeLabelFormats
          },
        },
        yAxis: {
          max: 100,
          title: false,
          showFirstLabel: false,
          labels: {
            formatter: function () {
              return this.value + " %";
            },
          },
          plotLines: [
            {
              color: "black",
              dashStyle: "dot",
              value: 25,
              width: 1.5,
              zIndex: 10000,
              label: {
                text: "25 %",
                rotation: 0,
                textAlign: "center",
                y: -10,
                align: "center",
                style: {
                  color: "#444",
                },
              },
            },
            {
              color: "black",
              dashStyle: "dot",
              value: 50,
              width: 1.5,
              zIndex: 10000,
              label: {
                text: "50 %",
                rotation: 0,
                textAlign: "center",
                y: -10,
                align: "center",
                style: {
                  color: "#444",
                },
              },
            },
            {
              color: "black",
              dashStyle: "dot",
              value: 75,
              width: 1.5,
              zIndex: 10000,
              label: {
                text: "75 % z aktuálně nakažených",
                rotation: 0,
                textAlign: "center",
                y: -10,
                align: "center",
                style: {
                  color: "#444",
                },
              },
            },
          ],
        },
        labels: [
          {
            point: {
              // xAxis: Date.parse('2020-01-12'),
              // yAxis: 0,
              x: Date.parse("2020-04-12"),
              y: 200,
            },
            // x: 20,
            // y: -20,
            text: "Lorem ipsum",
          },
        ],
        tooltip: {
          formatter: function () {
            return `Dne ${Highcharts.dateFormat(
              "%e. %m.",
              this.x
            )} se nakazilo <b>${this.y}</b> osob ve věku 65+ let`;
          },
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          area: {
            stacking: "normal",
            label: {
              visible: false
            }

          },
          series: {
            marker: {
              enabled: false,
              symbol: "circle",
              radius: 2,
            },
          },
        },
        series: [
          {
            type: "area",
            name: "ostatní nakažení",
            data: others,
            color: "#eee",
            lineWidth: 1,
          },
          {
            type: "area",
            name: "poměr mladých",
            data: ratioYoung,
            color: "#e63946",
            lineWidth: 1,
          },
          // {
          //   type: "line",
          //   name: "pětidenní průměr",
          //   data: slideAvg,
          //   color: "#000",
          //   // lineWidth: 1
          // },
        ],
      });
    });
})();
