(function () {
  const ids = {
    LBK: 'Liberecký',
    ZLK: 'Zlínský',
    MSK: 'Moravskoslezský',
    PAK: 'Pardubický',
    KVK: 'Karlovarský',
    STC: 'Středočeský',
    PLK: 'Plzeňský',
    PHA: 'Praha',
    JHC: 'Jihočeský',
    VYS: 'Vysočina',
    ULK: 'Ústecký',
    HKK: 'Královéhradecký',
    JHM: 'Jihomoravský',
    OLK: 'Olomoucký',
  };

  fetch('https://data.irozhlas.cz/covid-uzis/nemocnice.json')
    .then((response) => response.json())
    .then((data) => {
      data.sort((a, b) => Date.parse(a.upd) - Date.parse(b.upd));
      data.forEach((day) => { day.upd = day.upd.substring(0, 10); });

      const srs = [];
      const tmp = {};
      const dailyRanges = []; // [ date, minRate, maxRate ]
      const lastDay = data[data.length - 1].upd;

      data.forEach((day) => {
        Object.keys(day.regions).forEach((reg) => {
          if (!(reg in tmp)) {
            tmp[reg] = [];
          }

          // ------------ vypocet procenta volnych luzek
          const pct = ((day.regions[reg].AROJIP_luzka_covid
            + day.regions[reg].AROJIP_luzka_necovid) / day.regions[reg].AROJIP_luzka_celkem) * 100;
          tmp[reg].push([Date.parse(day.upd), pct]); // [ den, volna_luzka_% ]
        });

        // -------------- compute daily ranges
        let dayMin = Infinity; let
          dayMax = 0;
        Object.keys(day.regions).forEach((reg) => {
          const dayRgnRate = tmp[reg].filter((a) => a[0] == Date.parse(day.upd))[0][1];

          dayMin = Math.min(dayMin, dayRgnRate);
          dayMax = Math.max(dayMax, dayRgnRate);
        });
        dailyRanges.push([Date.parse(day.upd), dayMin, dayMax]);
      });

      Object.keys(tmp).forEach((regID) => { // regID : STC, HKK, ...
        srs.push(
          {
            name: ids[regID],
            data: tmp[regID],
            visible: !!['PHA', 'JHM', 'VYS', 'JHC'].includes(regID),
            marker: {
              enabled: false,
              symbol: 'circle',
            },
          },
        );
      });

      const upd = new Date(data.slice(-1)[0].upd);

      function onChartLoad(e) {
        const test = document.getElementById(e.renderTo.id);
        const plotBack = document.getElementById(e.renderTo.id).getElementsByClassName('highcharts-plot-background')[0];
        let shouldBeHeight = 0; // = plotBack.width.baseVal.value * 0.6;
        // const heightDiff = 0;
        const displayWidth = window.screen.width;
        if (displayWidth < 576) {
          shouldBeHeight = plotBack.width.baseVal.value * 0.6;
        } else { // if (displayWidth < 758) {
          shouldBeHeight = plotBack.width.baseVal.value * 0.45;
        }

        const heightDiff = shouldBeHeight - plotBack.height.baseVal.value;
        if (heightDiff > 0) {
          document.getElementById(e.renderTo.id).style.height = `${e.chartHeight + heightDiff}px`;
          e.reflow();
        }
      }

      Highcharts.setOptions({
        plotOptions: {
          series: {
            animation: false,
          },
        },
        chart: {
          animation: false,
        },
      });
      Highcharts.chart('corona_nemocnice_vse', {
        chart: {
          type: 'line',
          spacingLeft: 0,
          spacingRight: 0,
          events: {
            load() {
              onChartLoad(this);
            },
          },
        },
        title: {
          text: 'Volná kapacita na jednotkách ARO a JIP',
          useHTML: true,
        },
        subtitle: {
          text: "<span style='background-color: #e7e7e7;'>"
          + "<span style='color:#e7e7e7'>.</span>Šedá plocha </span> označuje rozmezí volné lůžkové kapacity mezi kraji. " + `Naposledy aktualizováno ${upd.getDate()}. ${upd.getMonth() + 1}. 2020.` // v ${upd.getHours()}:${upd.getMinutes()}`
          + "<span class='mock-empty-line'><br>.</span>",
          useHTML: true,
        },
        colors: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', 'black', '#b15928'],
        credits: {
          href: 'https://www.hlidacstatu.cz/kapacitanemocnic/',
          text: 'Zdroj dat: Hlídač státu',
        },
        yAxis: {
          title: {
            enabled: false,
            text: 'volná kapacita v %',
          },
          labels: {
            align: 'left',
            x: 0,
            y: -3,
            formatter() {
              if (this.isLast) {
                return `${this.value
                } %<br>volných lůžek`;
                // + ' %<br><span class="axis-label-on-tick">volných lůžek</span>'
              }
              return `${this.value} %`;
            },
          },
          offset: 30,
          max: 60,
          tickLength: -100,
          tickWidth: 1,
          tickColor: '#e6e6e6',
          // left: 10
        },
        xAxis: {
          type: 'datetime',
          endOnTick: false,
          showLastLabel: false,
          startOnTick: false,
          tickInterval: 1000 * 60 * 60 * 24,
          tickColor: '#e6e6e6',
          labels: {
            formatter() {
              return Highcharts.dateFormat('%d. %m.', this.value);
            },
          },
          // plotLines: [
          //   {
          //     // value: Date.parse("2020-09-22"),
          //     value: Date.parse(lastDay),
          //     width: 0,
          //     // zIndex: 10000,
          //     label: {
          //       text: "<span style='color: #999; font-weight: bold; background-color: #ff0000'>Šedá plocha </span> značí rozsah<br>volné lůžkové kapacity<br>v jednotlivých krajích",
          //       rotation: 0,
          //       textAlign: "right",
          //       y: -3,
          //       align: "left",
          //       style: {
          //         color: "#444"
          //       },
          //     },
          //   },
          // ],
        },
        tooltip: {
          formatter() {
            return this.points.reduce(
              (s, point) => (point.series.name === 'Range'
                ? s
                : `${s}<br/><span style="color: ${point.series.color};">${point.series.name}: ${(Math.round(point.y * 10) / 10).toFixed(1)} %`),
              `<b>${Highcharts.dateFormat('%d. %m.', this.x)}</b>`,
            );
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
            lineWidth: 1.5,
            marker: {
              enabled: false,
              // radius: 4,
              states: {
                hover: {
                  enabled: true,
                  halo: {
                    size: 0,
                  },
                  lineWidthPlus: 0,
                },
              },
            },
            // dashStyle: 'dash',

          },
          series: {
            label: {
              connectorAllowed: false,
            },
          },
        },
        series: [
          {
            name: 'Range',
            data: dailyRanges,
            type: 'arearange',
            linkedTo: ':previous',
            zIndex: 0,
            fillOpacity: 0.1,
            lineWidth: 0,
            color: '#777',
            marker: {
              enabled: false,
            },
          },
          ...srs,
        ],
      });
    });
}());
