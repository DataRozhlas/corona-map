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

  Highcharts.chart("corona_cz_pozitivni_pct", {
    chart: {
      type: "line",
    },
    title: {
      text: "Srovnání pozitivity u antigenních a PCR testů",
      useHTML: true,
    },
    subtitle: {
      text:
        "Když se oddělí dva hlavní druhy testů, vychází pozitivita podstatně nižší než ta oficiální" +
        // pridej, kdy se prekryva podnadpis s osou
        "<span class='mock-empty-line'><br>.</span>",
      useHTML: true,
    },
    credits: {
      href: "https://share.uzis.cz/s/rR34S7bCtP3ambH/download",
      text: "Zdroj: Ministerstvo zdravotnictví ČR",
    },
    xAxis: {
      type: "datetime",
      crosshair: true,

    },
    yAxis: {
      title: {
        text: "procento pozitivních",
      },
    },
    tooltip: {
      valueSuffix: " %",
      shared: true,
      valueDecimals: 1,
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      series: {
        pointStart: Date.UTC(2020, 9, 1),
        pointInterval: 24 * 3600 * 1000, // one day
      },
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: true,
        dataLabels: {
          enabled: false,
        },
        marker: false,
        // marker: {
        //   symbol: 'circle',
        //   radius: 2
        // }
        pointPlacement: "on",
      },
    },
    series: [
      {
        name: "antigenní",
        data: data.data.map((i) => (i[15] + i[16]) / i[2] * 100),
        color: "#e63946",
      },
      {
        name: "PCR",
        data: data.data.map((i) => (i[13] + i[16]) / i[1] * 100),
        color: "#3E80B6",
      },
    ],
  });
});
