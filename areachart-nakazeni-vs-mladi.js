(function () {
  fetch("https://data.irozhlas.cz/covid-uzis/osoby.json")
    .then((response) => response.json())
    .then((data) => {
      const dt = [];
      const dtAgeGroups = {
        '15': [],
        '25': [],
        '35': [],
        '45': [],
        '55': [],
        '65': [],
        '75': [],
        '85': [],
        'rest': []
      };
      const ratios = {
        '15': [],
        '25': [],
        '35': [],
        '45': [],
        '55': [],
        '65': [],
        '75': [],
        '85': [],
        'rest': []
      }; 
      // const dtAgeGroupsWeekly = {
      //   '15': [],
      //   '25': [],
      //   '35': [],
      //   '45': [],
      //   '55': [],
      //   '65': [],
      //   '75': [],
      //   '85': [],
      //   'rest': []
      // };
      const ages = [15, 25, 35, 45, 55, 65, 75, 85]

      let ageColors = {
        '15': '#11A579',
        '25': '#3969AC',
        '45': '#F2B701',
        '35': '#E73F74',
        '55': '#7F3C8D',
        '65': '#80BA5A',
        '75': '#E68310',
        '85': '#008695',
        'rest': '#CF1C90',
      }
      let visColors = {
        'dashedLine' : "#0005",
      }

      // sum record by days
      data.data.forEach((row) => {
        const pDate = Date.parse(row.DatumHlaseni);
        let rec = dt.find((e) => e[0] === pDate);
        if (rec !== undefined) {
          rec[1] += 1;
        } else {
          dt.push([pDate, 1]);
        }
      });

      // divide cases by age
      data.data.forEach((row) => {
        let vek = parseInt(row.Vek)
        const pDate = Date.parse(row.DatumHlaseni);

        for (i = 0; i < ages.length; i++) {
          if (vek < ages[i]) {
            let rec = dtAgeGroups[ages[i].toString()].find((e) => e[0] === pDate);
            if (rec !== undefined) { rec[1] += 1 } else { dtAgeGroups[ages[i].toString()].push([pDate, 1])}
            break;
          }
        }
        if (vek >= 85) {
          let rec = dtAgeGroups['rest'].find((e) => e[0] === pDate);
          if (rec !== undefined) { rec[1] += 1 } else { dtAgeGroups['rest'].push([pDate, 1])}
        }
      });

      // setrizeni dat v jednoltivych vekovych kategoriich podle data dne
      dt.sort((a, b) => { return a[0] - b[0]; });
      for (const group in dtAgeGroups) {
        dtAgeGroups[group].sort((a, b) => { return a[0] - b[0]; })
      }

      // Vypocet hodnot po tydnech, neotestovany
      /*
      for (const group in dtAgeGroups) {
        let aGroup = dtAgeGroups[group]
        for (i = 0; i < aGroup.length; i += 7) {
          let sum = aGroup.slice(i, i+7).reduce((a, b) => a + b[1], 0)
          dtAgeGroupsWeekly[group].push([ aGroup[i][0], sum])
        }
        console.log(dtAgeGroupsWeekly)
      }
      */

      // dopocitani ratios pro jednotlive vekove kategorie
      dt.forEach(d => {
        let dailyRecords;
        for (const group in dtAgeGroups) {
          dailyRecords = dtAgeGroups[group].find((e => e[0] === d[0]))
          if (dailyRecords) {
            ratios[group].push([ d[0], ( dailyRecords[1] / d[1] ) * 100 ]);
          } else { ratios[group].push([ d[0], 0])}
        }
      })

      function getDate() {
        return Date.parse("2020-01-12");
      }

      Highcharts.setOptions({
        lang: {
          months: ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'],
          shortMonths: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
          // shortMonths: ['led', 'úno', 'bře', 'dub', 'kvě', 'čen', 'čec', 'srp', 'zář', 'říj', 'lis', 'pro'],
          decimalPoint: ',',
          numericSymbols: [' tis.', ' mil.', 'mld.', 'T', 'P', 'E'],
          rangeSelectorFrom: 'od',
          rangeSelectorTo: 'do',
          rangeSelectorZoom: 'vyberte období:',
        },
      });    

      Highcharts.chart("corona_ratio_young_abs", {
        chart: {
          type: "area",
          // height: 600
        },
        credits: {
          href: "https://koronavirus.mzcr.cz/",
          text: "Zdroj dat: MZ ČR",
        },
        colors: ["#EB5C68"], //edae49
        title: {
          text: "Mladých nakažených přibývá jen pozvolna",
          useHTML: true
        },
        // subtitle: {
        //   text: "nárůst zaznamenává skupina 24 až 35 let"
        //   + '<br><span style="color: #fff">.</span>',
        //   useHTML: true
        // },
        xAxis: {
          crosshair: true,
          type: "datetime",
          dateTimeLabelFormats: {
            day: "%e. %b", //https://api.highcharts.com/highcharts/yAxis.dateTimeLabelFormats
          },
          plotLines: [
            {
              color: "black",
              dashStyle: "dot",
              value: Date.parse("2020-03-12"),
              width: 1.5,
              zIndex: 10000,
              label: {
                text: "Vyhlášen<br>nouzový<br>stav",
                rotation: 0,
                textAlign: "left",
                y: 20,
                align: "left",
                style: {
                  color: "#444",
                  fontStyle: 'italic'
                },
              },
            },
            {
              value: Date.parse("2020-04-12"),
              width: 0,
              zIndex: 10000,
              label: {
                text: "nakažení celkem",
                rotation: 0,
                textAlign: "left",
                y: 100,
                align: "left",
                style: {
                  color: "#aaa",
                  fontWeight: 'bold'
                },
              },
            },
          ],
        },
        yAxis: {
          // visible: false,
          title: false,
          showFirstLabel: false,
          labels: {
            enabled: false,
            // formatter: function () {
            //   if (this.isLast) {
            //         return this.value + '<br>' +
            //                     '<span class="light-gray-text">osob</span>'
            //                     // '<span class="light-gray-text">návěstidla</span>'
            //       } else {
            //         return this.value
            //       }
            },
          // },
          plotLines: [
            {
              color: visColors['dashedLine'],
              dashStyle: "dot",
              value: 100,
              width: 0,
              zIndex: 1000,
              label: {
                text: "100",
                rotation: 0,
                textAlign: "left",
                y: -5,
                x: -10,
                align: "left",
                style: {
                  color: "#666",
                  // fontWeight: 'bold'
                },
              },
            },
            {
              color: visColors['dashedLine'],
              dashStyle: "dot",
              value: 200,
              width: 0,
              zIndex: 10000,
              label: {
                text: "200",
                rotation: 0,
                textAlign: "left",
                y: -5,
                x: -10,
                align: "left",
                style: {
                  color: "#666",
                  // fontWeight: 'bold'
                },
              },
            },
            {
              color: visColors['dashedLine'],
              dashStyle: "dot",
              value: 300,
              width: 0,
              zIndex: 10000,
              label: {
                text: "300",
                rotation: 0,
                textAlign: "left",
                y: -5,
                x: -10,
                align: "left",
                style: {
                  color: "#666",
                  // fontWeight: 'bold'
                },
              },
            },
            {
              color: visColors['dashedLine'],
              width: 0,
              value: 400,
              zIndex: 10000,
              label: {
                text: "400<br>osob",
                rotation: 0,
                textAlign: "left",
                y: -5,
                x: -10,
                align: "left",
                style: {
                  color: "#666",
                  // fontWeight: 'bold'
                },
              },
            },
          ],
        },
        tooltip: {
          shared: true,
          useHTML: true,
        },
        legend: {
          reversed: true
        },
        plotOptions: {
          series: {
            marker: {
              enabled: false,
              symbol: "circle",
              radius: 2,
            },
            lineWidth: 0,
            /*
            events: {
              legendItemClick: function() {
                let chart = this.chart, 
                allSeries = chart.series,
                i = allSeries.length, 
                currSeries;

                while (i--) {
                  currSeries = allSeries[i];
                  if (currSeries != this && currSeries.visible) {
                    if (currSeries.name !== "nakažení celkem") { currSeries.hide();} 
                  } 
                }

                if (this.visible) {
                  return false;
                }
              }
            }
            */
          },
          area: {
            label: {
              enabled: false
            },
            stacking: 'normal'
          },
        },
        series: [
          {
            type: "area",
            name: "nakažení celkem",
            data: dt,
            color: "#999",
            lineColor: '#333',
            lineWidth: 0.5,
            opacity: 0.3,
            showInLegend: false,
            stacking: undefined
          },
          {
            type: "area",
            name: "85 let a starší",
            color: ageColors['rest'],
            data: dtAgeGroups['rest'],
            visible: false
          },
          {
            type: "area",
            name: "75-84 let",
            color: ageColors['85'],
            data: dtAgeGroups['85'],
            visible: false
          },
          {
            type: "area",
            name: "65-74 let",
            color: ageColors['75'],
            data: dtAgeGroups['75'],
            visible: false
          },
          {
            type: "area",
            name: "55-64 let",
            color: ageColors['65'],
            data: dtAgeGroups['65'],
            visible: false
          },
          {
            type: "area",
            name: "45-54 let",
            color: ageColors['55'],
            data: dtAgeGroups['55'],
            visible: false
          },
          {
            type: "area",
            name: "35-44 let",
            color: ageColors['45'],
            data: dtAgeGroups['45'],
            visible: false
          },
          {
            type: "area",
            name: "25-34",
            color: ageColors['35'],
            data: dtAgeGroups['35'],
          },
          {
            type: "area",
            name: "15-24",
            color: ageColors['25'],
            data: dtAgeGroups['25'],
          },
          {
            type: "area",
            name: "0-14",
            color: ageColors['15'],
            data: dtAgeGroups['15'],
            // visible: false
          },
        ],
      });

      Highcharts.chart("corona_ratio_young_rel", {
        chart: {
          type: "area",
        },
        title: {
          text: "Podíl nakažených mladých ve všech nakažených",
          useHTML: true,
        },
        // subtitle: {
        //   text: "24-35 let?" + '<br><span style="color: #fff">.</span>',
        //   useHTML: true,
        // },
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
            enabled: false,
            formatter: function () {
              return this.value + " %";
            },
          },
          plotBands: [{
            color: '#f3f3f3',
            from: 0, 
            to: Date.parse("2020-04-12"),
          }],
          plotLines: [
            {
              color: visColors['dashedLine'],
              dashStyle: "dot",
              value: 25,
              width: 1.5,
              zIndex: 1000,
              label: {
                text: "25 %",
                rotation: 0,
                textAlign: "left",
                y: -5,
                x: -10,
                align: "left",
                style: {
                  color: "#666",
                  // fontWeight: 'bold'
                },
              },
            },
            {
              color: visColors['dashedLine'],
              dashStyle: "dot",
              value: 50,
              width: 1.5,
              zIndex: 10000,
              label: {
                text: "50 %",
                rotation: 0,
                textAlign: "left",
                y: -5,
                x: -10,
                align: "left",
                style: {
                  color: "#666",
                  // fontWeight: 'bold'
                },
              },
            },
            {
              color: visColors['dashedLine'],
              dashStyle: "dot",
              value: 75,
              width: 1.5,
              zIndex: 10000,
              label: {
                text: "75 % z aktuálně nakažených",
                rotation: 0,
                textAlign: "left",
                y: -5,
                x: -10,
                align: "left",
                style: {
                  color: "#666",
                  // fontWeight: 'bold'
                },
              },
            },
            {
              color: visColors['dashedLine'],
              dashStyle: "dot",
              value: 100,
              width: 1.5,
              zIndex: 10000,
              label: {
                text: "100 % = všichni aktuálně  nakažení",
                rotation: 0,
                textAlign: "left",
                y: -5,
                x: -10,
                align: "left",
                style: {
                  color: "#666",
                  // fontWeight: 'bold'
                },
              },
            },
          ],
        },
        labels: [
          {
            point: {
              x: Date.parse("2020-04-12"),
              y: 200,
            },
            text: "Lorem ipsum",
          },
        ],
        tooltip: {
          shared: true,
          useHTML: true,
          valueDecimals: 1,
          zIndex: 12000,
          valueSuffix: ' %',
        },
        legend: {
          reversed: true
        },
        plotOptions: {
          area: {
            stacking: "normal",
            label: {
              enabled: false
            },
            lineWidth: 0.5
          },
          series: {
            marker: {
              enabled: false,
              symbol: "circle",
              radius: 2,
            },
            /*
            events: {
              legendItemClick: function() {
                let chart = this.chart, 
                allSeries = chart.series,
                i = allSeries.length, 
                currSeries;

                while (i--) {
                  currSeries = allSeries[i];
                  if (currSeries != this && currSeries.visible) {
                    currSeries.hide();
                  } 
                }
                if (this.visible) {
                  return false;
                }
              }
            }
            */
          },
        },
        series: [
        {
          type: "area",
          name: "85 let a starší",
          data: ratios['rest'],
          color: ageColors['rest'],
          visible: false
        },
        {
          type: "area",
          name: "75-84 let",
          color: ageColors['85'],
          data: ratios['85'],
          visible: false
        },
        {
          type: "area",
          name: "65-74 let",
          color: ageColors['75'],
          data: ratios['75'],
          visible: false
        },
        {
          type: "area",
          name: "55-64 let",
          color: ageColors['65'],
          data: ratios['65'],
          visible: false
        },
        {
          type: "area",
          name: "45-54 let",
          color: ageColors['55'],
          data: ratios['55'],
          visible: false
        },
        {
          type: "area",
          name: "35-44 let",
          color: ageColors['45'],
          data: ratios['45'],
          visible: false
        },
        {
          type: "area",
          name: "25-34",
          color: ageColors['35'],
          data: ratios['35'],
          // visible: false
        },
        {
          type: "area",
          name: "15-24",
          color: ageColors['25'],
          data: ratios['25'],
          // visible: false
        },
        {
          type: "area",
          name: "0-14",
          color: ageColors['15'],
          data: ratios['15'],
          // visible: false
        },
        ],
      });
    });
})();
