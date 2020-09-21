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
      const srs = [];
      const tmp = {};
      data.forEach((day) => {
        Object.keys(day.regions).forEach((reg) => {
          if (!(reg in tmp)) {
            tmp[reg] = [];
          }
          const pct = ((day.regions[reg].AROJIP_luzka_covid
            + day.regions[reg].AROJIP_luzka_necovid) / day.regions[reg].AROJIP_luzka_celkem) * 100;
          tmp[reg].push([Date.parse(day.upd), pct]);
        });
      });
      Object.keys(tmp).forEach((regID) => {
        srs.push(
          {
            name: ids[regID],
            data: tmp[regID],
            visible: true,
            marker: {
              symbol: 'circle',
            },
          },
        );
      });

      const upd = new Date(data.slice(-1)[0].upd);

      Highcharts.chart('corona_nemocnice', {
        chart: {
          type: 'line',
        },
        title: {
          text: 'Volná kapacita na jednotkách ARO a JIP',
          useHTML: true,
        },
        subtitle: {
          text: `Aktualizováno v ${upd.getDate()}. ${upd.getMonth() + 1}. v ${upd.getHours()}:${upd.getMinutes()}`,
        },
        colors: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', 'black', '#b15928'],
        credits: {
          href: 'https://www.hlidacstatu.cz/kapacitanemocnic/',
          text: 'Zdroj dat: Hlídač státu',
        },
        yAxis: {
          title: {
            text: 'volná kapacita v %',
          },
        },
        xAxis: {
          type: 'datetime',
          endOnTick: true,
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
            return this.points.reduce((s, point) => `${s}<br/><span style="color: ${point.series.color};">${point.series.name}: ${(Math.round(point.y * 10) / 10).toFixed(1)} %`, `<b>${Highcharts.dateFormat('%d. %m.', this.x)}</b>`);
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
