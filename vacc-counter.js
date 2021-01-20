const vacStart = new Date(2020, 11, 27);
const vacEnd = new Date(2022, 05, 30);
const dnuVakcinace = Math.floor((new Date() - vacStart) / 86400000);
const dnuDoKonce = Math.floor((vacEnd - new Date()) / 86400000);
const planLidi = 6953849;
const planDavek = 11901700;
const davkyAplikovane = 70680;
const dnuDoSplneni =
  (planDavek - davkyAplikovane) / (davkyAplikovane / dnuVakcinace);
const pctHotovo = Math.round((davkyAplikovane / planDavek) * 1000) / 1000;

const pocitadlo = document.querySelector("#pocitadlo");
const progresbar = document.createElement("DIV");
progresbar.id = "progresbar";
pocitadlo.appendChild(progresbar);
const dashboardik = document.createElement("DIV");
dashboardik.id = "dashboardik";
pocitadlo.appendChild(dashboardik);

const p1 = document.createElement("DIV");
p1.classList.add("boxik");
p1.innerHTML = `<div class='cislo'>${Math.floor((new Date() - vacStart) / 86400000)} dnů</div><div class='vysvetl'>uplynulo od začátku očkování v Česku</div>`;
dashboardik.appendChild(p1);

const p2 = document.createElement("DIV");
p2.classList.add("boxik");
p2.innerHTML = `<div class='cislo'>${davkyAplikovane.toLocaleString("cs")} dávek</div><div class="vysvetl">vakcíny zdravotníci použili</div>`;
dashboardik.appendChild(p2);

const p3 = document.createElement("DIV");
p3.classList.add("boxik");
p3.innerHTML = `<div class='cislo'>${Math.floor(
  davkyAplikovane / dnuVakcinace
).toLocaleString("cs")} za den</div><div class='vysvetl'>průměrně aplikovaných dávek</div>`;
dashboardik.appendChild(p3);

const p4 = document.createElement("DIV");
p4.classList.add("boxik");
p4.classList.add("strategie");
p4.innerHTML = `<div class='cislo'>6,9 mil. lidí</div><div class='vysvetl'>má být naočkováno do června 2022</div>`;
dashboardik.appendChild(p4);

const p5 = document.createElement("DIV");
p5.classList.add("boxik");
p5.classList.add("strategie");
p5.innerHTML = `<div class='cislo'>11,9 mil. dávek</div><div class='vysvetl'>vakcín k tomu bude potřeba</div>`;
dashboardik.appendChild(p5);

const p6 = document.createElement("DIV");
p6.classList.add("boxik");
p6.innerHTML = `<div class='cislo'>${Math.floor(
  dnuDoSplneni
).toLocaleString("cs")} dnů</div><div class='vysvetl'>by trvalo splnění plánu dosavadním tempem</div>`;
dashboardik.appendChild(p6);

const p7 = document.createElement("DIV");
p7.classList.add("boxik");
p7.innerHTML = `<div class='cislo'>${new Date(Date.now() + dnuDoSplneni * 86400000).toLocaleDateString("cs")}</div><div class='vysvetl'>by vláda splnila dosáhla cíle vakcinační strategie</div>`;
dashboardik.appendChild(p7);


const p8 = document.createElement("DIV");
p8.classList.add("boxik");
p8.innerHTML = `<div class='cislo'>${Math.floor(
  (planDavek - davkyAplikovane) / dnuDoKonce
).toLocaleString("cs")} za den</div><div class='vysvetl'>tolik dávek je potřeba, aby se očkování stihlo podle plánu</div>
`;
dashboardik.appendChild(p8);

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
        color: '#000',
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
      color: "#ededed",
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
