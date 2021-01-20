const vacStart = new Date(2020, 11, 27);
const vacEnd = new Date(2022, 05, 30);
const dnuVakcinace = Math.floor((new Date(2021, 0, 14) - vacStart) / 86400000);
const dnuDoKonce = Math.floor((vacEnd - new Date()) / 86400000);
const planLidi = 6953849;
const planDavek = 11901700;
const pocitadlo = document.querySelector("#pocitadlo");
const davkyAplikovane = 70680;
const dnuDoSplneni =
  (planDavek - davkyAplikovane) / (davkyAplikovane / dnuVakcinace);
const pctHotovo = Math.round((davkyAplikovane / planDavek) * 1000) / 1000;

const p1 = document.createElement("LI");
p1.innerHTML = `Od začátku očkování v Česku uplynulo <strong>${Math.floor(
  (new Date() - vacStart) / 86400000
)} dnů</strong>.`;
pocitadlo.appendChild(p1);

const p2 = document.createElement("LI");
p2.innerHTML = `Podle posledních <a href="https://onemocneni-aktualne.mzcr.cz/covid-19" target="_blank"> oficiálních informací</a> zdravotníci aplikovali <strong>${davkyAplikovane.toLocaleString(
  "cs"
)} dávek</strong> vakcíny. (Ministerstvo zdravotnictví data aktualizuje jednou týdně, poslední údaj je ze čtvrtka 14. ledna.)`;
pocitadlo.appendChild(p2);

const p3 = document.createElement("LI");
p3.innerHTML = `To je v průměru <strong>${Math.floor(
  davkyAplikovane / dnuVakcinace
).toLocaleString("cs")} dávek</strong> za den.`;
pocitadlo.appendChild(p3);

const p4 = document.createElement("LI");
p4.innerHTML = `Aby se plán naplnil, bylo by potřeba každý den aplikovat průměrně <strong>${Math.floor(
  (planDavek - davkyAplikovane) / dnuDoKonce
).toLocaleString("cs")} dávek</strong>.`;
pocitadlo.appendChild(p4);

const p5 = document.createElement("LI");
p5.innerHTML = `Podle vládní <a href="https://koronavirus.mzcr.cz/wp-content/uploads/2020/12/Strategie_ockovani_proti_covid-19_aktual_221220.pdf">Strategie očkování proti covid-19 v České republice</a> by mělo být v polovině roku 2022 naočkováno <strong>6,9 milionu lidí</strong>.`;
pocitadlo.appendChild(p5);

const p6 = document.createElement("LI");
p6.innerHTML = `Potřeba k tomu bude <strong>11,9 milionu dávek</strong>. (Zhruba dva miliony lidí mají dostat vakcínu společnosti Johnson&Johnson, která se skládá z jediné dávky. Ostatní by měli dostat dávky dvě.)`;
pocitadlo.appendChild(p6);

const p7 = document.createElement("LI");
p7.innerHTML = `Dosavadním tempem by Česko cíle očkovací strategie dosáhlo za <strong>${Math.floor(
  dnuDoSplneni
).toLocaleString("cs")} dnů</strong>, tj. <strong>${new Date(
  Date.now() + dnuDoSplneni * 86400000
).toLocaleDateString("cs")}</strong>.`;
pocitadlo.appendChild(p7);

const p8 = document.createElement("LI");
(p8.innerHTML =
  "Graf se automaticky aktualizuje, jakmile ministerstvo zdravotnictví zveřejní nová data"),
  pocitadlo.appendChild(p8);

Highcharts.chart("progresbar", {
  chart: {
    type: "bar",
    height: 225,
  },
  title: {
    text: `Jak vláda plní strategii očkování? Zbývá rozdat ${(
      100 -
      (davkyAplikovane / planDavek) * 100
    )
      .toFixed(1)
      .replace(".", ",")} % injekcí`,
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    categories: ["dávky vakcíny"],
    height: 50,
  },
  yAxis: {
    // min: 0,
    // max: 100,
    title: {
      text: "procento plánu",
    },
    tickAmount: 6,
    labels: {
      format: "{value} %",
    },
  },
  legend: {
    reversed: true,
    symbolRadius: 0,
    navigation: {
      enabled: false,
    },
  },
  plotOptions: {
    series: {
      stacking: 'percent',
      dataLabels: {
        enabled: true,
        formatter: function () {
          if (this.series.index === 1) {
            return `${this.percentage.toFixed(2).replace(".", ",")} %`;
          }
        },
        align : 'right',
        x: 5,
        color: '#FFFFFF',
        useHTML: true,
      },
    },
  },
  tooltip: {
    formatter: function () {
      return `${this.series.name}: ${this.percentage
        .toFixed(2)
        .replace(".", ",")} %,<br>tj. ${this.y} dávek vakcín`;
      console.log(this);
    },
  },
  series: [
    {
      name: "zbývá aplikovat",
      data: [planDavek - davkyAplikovane],
      color: "#aaaa",
      marker: {
        symbol: "square",
      },
    },
    {
      name: "aplikované",
      data: [davkyAplikovane],
      color: "#e63946",
    },
  ],
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          title: {
            text: `Jak vláda plní strategii očkování? Zbývá ${(
              100 -
              (davkyAplikovane / planDavek) * 100
            )
              .toFixed(1)
              .replace(".", ",")} %`,
          },
          xAxis: {
            categories: [""],
          },
        },
      },
    ],
  },
});
