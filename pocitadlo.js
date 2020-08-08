function niceDate(val) {
    const parts = val.split('/');
    return `${parts[2]}. ${parts[1]}.`;
}
  
  fetch('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/cases_time_v3/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Report_Date_String%20asc&resultOffset=0&resultRecordCount=2000&cacheHint=true')
    .then((response) => response.json())
    .then((data) => {
      const days = [];
      const cina = [];
      const svet = [];
      const vylec = [];
  
      data.features.forEach((ftr) => {
        if ( (window.screen.width < 600) & (ftr.attributes.Report_Date < 1581292800000) ) { // omezeni sire mobil (po 10. 2.)
          return
        }

        days.push(niceDate(ftr.attributes.Report_Date_String));
        cina.push(ftr.attributes.Mainland_China);
        svet.push(ftr.attributes.Other_Locations);
        vylec.push(ftr.attributes.Total_Recovered);
      });
  
      Highcharts.chart('corona_count', {
        title: {
          text: 'Počet případů koronaviru',
          useHTML: true
        },
        credits: {
          enabled: false,
        },
        subtitle: {
          text: 'Zdroj: <a class="vis-link" href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports">WHO</a>,' +
          ' <a class="vis-link" href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">CDC</a>,' + 
          ' <a class="vis-link" href="https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases">ECDC</a>,' + 
          ' <a class="vis-link" href="http://www.nhc.gov.cn/xcs/yqtb/list_gzbd.shtml">NHC</a> a <a class="vis-link" href="https://3g.dxy.cn/newh5/view/pneumonia?scene=2&amp;clicktime=1579582238&amp;enterid=1579582238&amp;from=singlemessage&amp;isappinstalled=0">DXY</a>.',
          useHTML: true
        },
        yAxis: {
          title: {
            text: 'případy',
          },
        },
        xAxis: {
          categories: days,
        },
        colors: ['#de2d26', '#756bb1', '#31a354'],
        legend: {
          layout: 'horizontal',
          verticalAlign: 'bottom',
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false,
            },
          },
        },
        tooltip: {
          shared: true,
          crosshairs: true,
        },
        series: [{
          name: 'Zjištění nakažení v pevninské Číně',
          data: cina,
        }, {
          name: 'Zjištěné případy v ostatních zemích',
          data: svet,
        }, {
          name: 'Celkem vyléčení',
          data: vylec,
        }],
      });
    });
  