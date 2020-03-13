(function() {
    const sURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv'

    const dURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv'

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
        "France": "Francie",
        "Czechia": "Česko",
    }

    fetch(sURL)
        .then(response => response.text())
        .then(data => {
            // statistiky
            const confirmed = d3.csvParse(data)

            fetch(dURL)
            .then(response => response.text())
            .then(data => {
                // statistiky
                let mapData = []
                const deaths = d3.csvParse(data)
                confirmed.forEach(state => {
                    //jmeno, provinci, potvrzeni, kde kdy
                    const country = state['Country/Region']
                    const province = state['Province/State']
                    const latLon = [state['Lat'], state['Long']]
                    
                    const dateKeys = Object.keys(state).filter(k => k.indexOf('/20') !== -1)
                    const conf = parseInt(state[dateKeys[dateKeys.length -1]].replace(',', ''))

                    
                    //spojit mrtvi
                    const dFiltered = deaths.filter(dst => (dst['Country/Region'] === country) & (dst['Province/State'] === province))[0]
                    const dFilteredKeys = Object.keys(dFiltered).filter(k => k.indexOf('/20') !== -1)
                    const passed = parseInt(dFiltered[dFilteredKeys[dFilteredKeys.length -1]].replace(',', ''))

                    mapData.push([country, province, latLon, conf, passed])
                })

                let casesSum = 0
                let deathsSum = 0
                mapData.forEach(row => {
                    casesSum += row[3]
                    deathsSum += row[4]
                })
                
                let stats = L.control({position: 'topleft'})
                stats.onAdd = function(map){
                    let div = L.DomUtil.create('div', 'stats')
                    div.innerHTML = `Celkem nakažených: ${casesSum}<br>Mrtvých: ${deathsSum}`
                    return div;
                }
                stats.addTo(mymap)
                
                const cWidth = d3.scaleSqrt().domain([0, casesSum]).range([5, 50])
                
                let pinGrp = new L.featureGroup()
                mapData.forEach( ftr => {
                    //body v mape
                    let mrk = L.circleMarker(ftr[2], {
                        radius: cWidth(ftr[3]),
                        color: '#de2d26',
                        opacity: 1,
                        weight: 1,
                        fillColor: '#de2d26',
                        fillOpacity: 0.5,
                    })
                    mrk.bindPopup(`<b>${ftr[1] || ''}<br>${cNames[ftr[0]] || ftr[0]}</b><br>Nakaženo: ${ftr[3]}<br>Mrtvých: ${ftr[4]}`)
                    mrk.addTo(pinGrp)
                })
                pinGrp.addTo(mymap)
                mymap.fitBounds(pinGrp.getBounds())
            })
    })
})()