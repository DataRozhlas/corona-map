async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function prepareDate(d) {
  [y, m, d] = d.split("-");
  return [Number(y), m - 1, Number(d.substring(0, 2))];
}

getData("https://data.irozhlas.cz/covid-uzis/ag_testy.json").then((data) => {
  data.data = data.data.filter((i) => {
    return new Date(...prepareDate(i[0])) >= new Date(2020, 10, 1);
  });
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
      text: "Počet antigenních a PCR testů po dnech",
      useHTML: true,
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
      dateTimeLabelFormats: {
        day: "%A, %e. %b %Y",
      },
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      series: {
        pointStart: Date.UTC(2020, 8, 1),
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
        name: "antigenní",
        data: data.data.map((i) => i[2]),
        color: "#e63946",
      },
      {
        name: "PCR",
        data: data.data.map((i) => i[1]),
        color: "#3E80B6",
      },
    ],
  });
});
