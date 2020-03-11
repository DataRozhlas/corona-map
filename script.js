const sURL = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=true&outFields=*&resultOffset=0&resultRecordCount=250&cacheHint=true'

let mymap = L.map('corona_map', {maxZoom: 6})
mymap.scrollWheelZoom.disable()
L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, data sources: <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports">WHO</a>, <a href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">CDC</a>, <a href="https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases">ECDC</a>,&nbsp;<a href="http://www.nhc.gov.cn/yjb/s3578/new_list.shtml">NHC</a>&nbsp;and <a href="https://3g.dxy.cn/newh5/view/pneumonia?scene=2&amp;clicktime=1579582238&amp;enterid=1579582238&amp;from=singlemessage&amp;isappinstalled=0">DXY</a>, data processed by <a href="https://systems.jhu.edu/">JHU CSSE</a>.',
}).addTo(mymap)

const cNames = {
    "Thailand": "Thajsko",
    "Japan": "Japonsko",
    "US": "USA",
    "Singapore": "Singapur",
    "Nepal": "Nepál",
    "Malaysia": "Malajsie",
    "Canada": "Kanada",
    "Australia": "Austrálie",
    "Cambodia": "Kambodža",
    "Sri Lanka": "Srí Lanka",
    "United Arab Emirates": "Spojené arabské emiráty",
    "Philippines": "Filipíny",
    "India": "Indie",
    "Others": "Ostatní",
    "Egypt": "Egypt",
    "Lebanon": "Libanon",
    "Iraq": "Irák",
    "Oman": "Omán",
    "Afghanistan": "Afghánistán",
    "Bahrain": "Bahrajn",
    "Kuwait": "Kuvajt",
    "Algeria": "Alžírsko",
    "Israel": "Izrael",
    "Pakistan": "Pákistán",
    "Brazil": "Brazílie",
    "Georgia": "Gruzie",
    "North Macedonia": "Severní Makedonie",
    "San Marino": "San Marino",
    "Belarus": "Bělorusko",
    "Iceland": "Island",
    "Lithuania": "Litva",
    "Mexico": "Mexiko",
    "New Zealand": "Nový Zéland",
    "Nigeria": "Nigérie",
    "Monaco": "Monako",
    "Qatar": "Katar",
    "Ecuador": "Ekvádor",
    "Azerbaijan": "Ázerbajdžán",
    "Armenia": "Arménie",
    "Dominican Republic": "Dominikánská republika",
    "Indonesia": "Indonésie",
    "Andorra": "Andorra",
    "Morocco": "Maroko",
    "Saudi Arabia": "Saudská arábie",
    "Senegal": "Senegal",
    "Argentina": "Argentina",
    "Chile": "Chile",
    "Jordan": "Jordán",
    "Saint Barthelemy": "Svatý Bartoloměj",
    "Faroe Islands": "Faerské ostrovy",
    "Gibraltar": "Gibraltar",
    "Tunisia": "Tunisko",
    "Bosnia and Herzegovina": "Bosna a Hercegovina",
    "South Africa": "Jižní Afrika",
    "Bhutan": "Bhútán",
    "Cameroon": "Kamerun",
    "Colombia": "Kolumbie",
    "Costa Rica": "Kostarika",
    "Peru": "Peru",
    "Serbia": "Srbsko",
    "Togo": "Togo",
    "French Guiana": "Francouzská Guyana",
    "Malta": "Malta",
    "Martinique": "Martinik",
    "Maldives": "Maledivy",
    "Bangladesh": "Bangladéš",
    "Paraguay": "Paraguay",
    "Albania": "Albánie",
    "Brunei": "Brunej",
    "Iran (Islamic Republic of)": "Írán (Islámská republika)",
    "Republic of Korea": "Korejská republika",
    "Hong Kong SAR": "SAR v Hongkongu",
    "Taipei and environs": "Tchaj-pej a okolí",
    "Viet Nam": "Vietnam",
    "occupied Palestinian territory": "okupované palestinské území",
    "Macao SAR": "Macao SAR",
    "Russian Federation": "Ruská Federace",
    "Republic of Moldova": "Moldavská republika",
    "Saint Martin": "Svatý Martin",
    "Burkina Faso": "Burkina Faso",
    "Channel Islands": "Normanské ostrovy",
    "Holy See": "Svatý stolec",
    "Mongolia": "Mongolsko",
    "Panama": "Panama",
    "Germany": "Německo",
    "Finland": "Finsko",
    "Italy": "Itálie",
    "UK": "Spojené království",
    "Sweden": "Švédsko",
    "Spain": "Španělsko",
    "Belgium": "Belgie",
    "Croatia": "Chorvatsko",
    "Switzerland": "Švýcarsko",
    "Austria": "Rakousko",
    "Greece": "Řecko",
    "Norway": "Norsko",
    "Romania": "Rumunsko",
    "Denmark": "Dánsko",
    "Estonia": "Estonsko",
    "Netherlands": "Holandsko",
    "Ireland": "Irsko",
    "Luxembourg": "Lucembursko",
    "Czech Republic": "Česko",
    "Portugal": "Portugalsko",
    "Latvia": "Lotyšsko",
    "Ukraine": "Ukrajina",
    "Hungary": "Maďarsko",
    "Liechtenstein": "Lichtenštejnsko",
    "Poland": "Polsko",
    "Slovenia": "Slovinsko",
    "Slovakia": "Slovensko",
    "Bulgaria": "Bulharsko",
    "Cyprus": "Kypr",
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