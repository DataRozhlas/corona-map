(function () {
  function parseCsv(fle) {
    const rows = fle.split('\r\n');
    const header = rows[0].split(',');
    const data = [];
    rows.slice(1).map((row) => {
      const rw = {};
      row.split(',').map((val, i) => {
        if (!isNaN(val)) {
          val = parseFloat(val) || parseInt(val);
        }
        rw[header[i]] = val;
      });
      data.push(rw);
    });
    return data;
  }


  Promise.all([
    fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-vyleceni-umrti-testy.csv').then((d) => d.text()), 
    fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-reinfekce.csv').then((d) => d.text()),
  ]).then((res) => {
    const dt = parseCsv(res[0]);
    const rei = parseCsv(res[1])
    
    let nakKum = 0
    const reiKum = {}
    rei.forEach((day) => {
      nakKum += (day.nove_pripady || 0) + (day.nove_reinfekce || 0)
      reiKum[day.datum] = nakKum;
    });

    const current = dt.map((v) => [Date.parse(v.datum), reiKum[v.datum]
      - v.kumulativni_pocet_vylecenych - v.kumulativni_pocet_umrti]);
          
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
        spacingLeft: 0,
        spacingRight: 0,
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
          const dat = dt.find((v) => Date.parse(v.datum) === this.x);
          const prev = dt.filter((v) => Date.parse(v.datum) < this.x);
          let prevDpct = '?';
          let prevD = 0;
          try {
            prevD = reiKum[prev[prev.length - 1].datum]
              - prev[prev.length - 1].kumulativni_pocet_vylecenych
              - prev[prev.length - 1].kumulativni_pocet_umrti;
            prevDpct = Math.round((1 - (prevD / this.y)) * 1000) / 10;
          } catch (err) { }

          return `<b>${Highcharts.dateFormat('%d. %m.', this.x)}</b>
                      <br><b><span style="color:#de2d26">Aktuální nemocní: ${this.y}</span></b>
                      <br>Denní nárůst: ${this.y - prevD} (${prevDpct} %)
                      <br>Vyléčení: ${dat.kumulativni_pocet_vylecenych || 0}
                      <br>Zemřelí: ${dat.kumulativni_pocet_umrti || 0}`;
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


  fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-vyleceni-umrti-testy.csv')
    .then((response) => response.text())
    .then((dt) => {
    });
}());
