const sURL = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=true&outFields=*&resultOffset=0&resultRecordCount=250&cacheHint=true'

let mymap = L.map('corona_map', {maxZoom: 6})
mymap.scrollWheelZoom.disable()
L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, data sources: <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports">WHO</a>, <a href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">CDC</a>, <a href="https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases">ECDC</a>,&nbsp;<a href="http://www.nhc.gov.cn/yjb/s3578/new_list.shtml">NHC</a>&nbsp;and <a href="https://3g.dxy.cn/newh5/view/pneumonia?scene=2&amp;clicktime=1579582238&amp;enterid=1579582238&amp;from=singlemessage&amp;isappinstalled=0">DXY</a>, data processed by <a href="https://systems.jhu.edu/">JHU CSSE</a>.',
}).addTo(mymap)

const cNames = {
    "Mainland China": "Pevninská Čína",
    "Hong Kong": "Hongkong",
    "Taiwan": "Tchaj-wan",
    "Macau": "Macau",
    "USA": "USA",
    "Japan": "Japonsko",
    "Thailand": "Thajsko",
    "South Korea": "Jižní Korea",
    "Singapore ": "Singapur",
    "Vietnam": "Vietnam",
    "France": "Francie",
    "Nepal": "Nepál",
    "Malaysia ": "Malajsie",
    "Canada": "Kanada",
    "Cambodia": "Kambodža",
    "Sri Lanka": "Srí Lanka",
    "Australia": "Austrálie",
    "Germany": "Německo",
    "Finland": "Finsko",
    "United Arab Emirates": "Spojené arabské emiráty",
    "Philippines": "Filipíny",
    "India": "Indie",
    "Italy": "Itálie ",
    "Belgium": "Belgie",
    "Austria": "Rakousko",
    "Russia": "Rusko",
    "Sweden": "Švédsko",
    "UK": "Spojené království",
    "Spain": "Španělsko",
    "Switzerland": "Švýcarsko",
    "Croatia": "Chorvatsko",
    "Greece": "Řecko",
    "Lebanon": "Libanon",
    "Brazil": "Brazílie",
    "Algeria": "Alžírsko",
    "Lebanon": "Libanon",
    "Afghanistan": "Afghánistán",
    "Iraq": "Irák",
    "Iran": "Írán",
    "Malaysia": "Malajsie",
    "Oman": "Omán",
    "Israel": "Izrael",
    "Bahrain": "Bahrajn",
    "Kuwait": "Kuvajt"
}

fetch(sURL)
    .then(response => response.json())
    .then(data => {
        // statistiky
        const cases = data.features.reduce((sum, val) => sum + val.attributes.Confirmed, 0)
        const deaths = data.features.reduce((sum, val) => sum + val.attributes.Deaths, 0)
        const recovered = data.features.reduce((sum, val) => sum + val.attributes.Recovered, 0)

        let stats = L.control({position: 'topleft'})
        stats.onAdd = function(map){
            let div = L.DomUtil.create('div', 'stats')
            div.innerHTML = `Celkem nakažených: ${cases}<br>Mrtvých: ${deaths}<br>Vyléčených: ${recovered}`
            return div;
        }
        stats.addTo(mymap)

        const cWidth = d3.scaleSqrt().domain([0, cases]).range([5, 50])
        
        let pinGrp = new L.featureGroup()
        data.features.forEach( ftr => {
            //body v mape
            let mrk = L.circleMarker([ftr.geometry.y, ftr.geometry.x], {
                radius: cWidth(ftr.attributes.Confirmed),
                color: '#de2d26',
                opacity: 1,
                weight: 1,
                fillColor: '#de2d26',
                fillOpacity: 0.5,
            })
            mrk.bindPopup(`<b>${ftr.attributes.Province_State || ''}<br>${cNames[ftr.attributes.Country_Region] || ftr.attributes.Country_Region}</b><br>Nakaženo: ${ftr.attributes.Confirmed}<br>Mrtvých: ${ftr.attributes.Deaths}<br>Vyléčených: ${ftr.attributes.Recovered || 0}`)
            mrk.addTo(pinGrp)
        })
        pinGrp.addTo(mymap)
        mymap.fitBounds(pinGrp.getBounds())
})