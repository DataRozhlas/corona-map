async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

getData("https://data.irozhlas.cz/covid-uzis/ag_testy.json").then((data) => {
  Highcharts.setOptions({
    lang: {
      months: [
        "ledna",
        "února",
        "března",
        "dubna",
        "května",
        "června",
        "července",
        "srpna",
        "září",
        "října",
        "listopadu",
        "prosince",
      ],
      shortMonths: [
        "leden",
        "únor",
        "březen",
        "duben",
        "květen",
        "červen",
        "červenec",
        "srpen",
        "září",
        "říjen",
        "listopad",
        "prosinec",
      ],
      decimalPoint: ",",
      numericSymbols: [" tis.", " mil.", "mld.", "T", "P", "E"],
      rangeSelectorFrom: "od",
      rangeSelectorTo: "do",
      rangeSelectorZoom: "vyberte období:",
      weekdays: [
        "neděle",
        "pondělí",
        "úterý",
        "středa",
        "čtvrtek",
        "pátek",
        "sobota",
      ],
    },
  });

  Highcharts.chart("corona_cz_ag", {
    chart: {
      type: "column",
    },
    title: {
      text: "Na přelomu roku se počet antigenních testů vyrovnal PCR testům",
      useHTML: true,
    },
    subtitle: {
      useHTML: true,
      text:
        "Ty, které skončily s negativním výsledkem, se však do podílu pozitivních nezapočítávaly",
      // + '<br><span style="color: #fff">.</span>',
    },
    credits: {
      href: "https://share.uzis.cz/s/rR34S7bCtP3ambH/download",
      text: "Zdroj: Ministerstvo zdravotnictví ČR",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "počet testů",
      },
      // showFirstLabel: false,
      // labels: {
      // formatter: function() {
      //   if (this.isLast) {
      //     return this.value + '<br>' +
      //                 '<span class="light-gray-text">jízd za</span>' + '<br>' +
      //                 '<span class="light-gray-text">návěstidla</span>'
      //   } else {
      //     return this.value
      //   }
      // }
      // }
    },
    tooltip: {
      valueSuffix: " testů",
      shared: true,
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      series: {
        pointStart: Date.UTC(2020, 9, 1),
        pointInterval: 24 * 3600 * 1000, // one day
      },
      column: {
        dataLabels: {
          enabled: false,
        },
        enableMouseTracking: true,
        pointPadding: 0.1,
        groupPadding: 0.15,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "PCR",
        data: data.data.map((i) => i[1]),
        color: "#3E80B6",
      },
      {
        name: "antigenní",
        data: data.data.map((i) => i[2]),
        color: "#e63946",
      },
    ],
  });
});
