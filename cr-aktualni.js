(function () {
  fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-vyleceni-umrti-testy.json')
    .then((response) => response.json())
    .then((dt) => {
      const current = dt.data.map((v) => [Date.parse(v.datum), v.kumulovany_pocet_nakazenych
        - v.kumulovany_pocet_vylecenych - v.kumulovany_pocet_umrti]);
      const chartWidth = document.getElementById('corona_cz_akt').offsetWidth;
      let chartHeight = chartWidth * 0.4;
      if (chartWidth < 400) {
        chartHeight = chartWidth * 0.8;
      } else if (chartWidth < 500) {
        chartHeight = chartWidth * 0.6;
      } else if (chartWidth < 600) {
        chartHeight = chartWidth * 0.5;
      } else if (chartWidth < 800) {
        chartHeight = chartWidth * 0.45;
      } else {
        (
          chartHeight = chartWidth * 0.4
        );
      }

      Highcharts.chart('corona_cz_akt', {
        chart: {
          height: chartHeight,
        },
        title: {
          text: 'Aktuálně zjištění nemocní COVID-19 v Česku (bez vyléčených a zemřelých)',
          useHTML: true,
        },
        credits: {
          href: 'https://koronavirus.mzcr.cz/',
          text: 'Zdroj dat: MZ ČR',
        },
        yAxis: {
          title: false,
          showFirstLabel: false,
          endOnTick: false,
          labels: {
            formatter() {
              return `${this.value}<br>osob`;
            },
          },
        },
        xAxis: {
          type: 'datetime',
          startOnTick: false,
          endOnTick: false,
          showLastLabel: true,
          labels: {
            formatter() {
              return Highcharts.dateFormat('%d. %m.', this.value);
            },
          },
        },
        tooltip: {
          backgroundColor: '#ffffffee',
          formatter() {
            const dat = dt.data.find((v) => Date.parse(v.datum) === this.x);
            const prev = dt.data.filter((v) => Date.parse(v.datum) < this.x);
            let prevDpct = '?';
            try {
              const prevD = prev[prev.length - 1].kumulovany_pocet_nakazenych
                - prev[prev.length - 1].kumulovany_pocet_vylecenych
                - prev[prev.length - 1].kumulovany_pocet_umrti;
              prevDpct = Math.round((1 - (prevD / this.y)) * 1000) / 10;
            } catch (err) {}

            return `<b>${Highcharts.dateFormat('%d. %m.', this.x)}</b>
                        <br><b><span style="color:#de2d26">Aktuální nemocní: ${this.y}</span></b> (denní nárůst: ${prevDpct} %)
                        <br>Vyléčení: ${dat.kumulovany_pocet_vylecenych || 0}
                        <br>Zemřelí: ${dat.kumulovany_pocet_umrti || 0}`;
          },
          useHTML: true,
        },
        legend: false,
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
        series: [
          {
            name: 'Aktuálně nemocní',
            data: current,
            color: '#e63946',
            visible: true,
            marker: {
              symbol: 'circle',
            },
          },
        ],
      });
    });
}());
