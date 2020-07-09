(function() {
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
      }

    const euNames = {
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

    let confirmed,
        deaths,
        revovered

    function getLastVal(obj) {
        const tmp = Object.keys(obj).map(v => {
            if (v.indexOf('/20') > -1) {
                return [Date.parse(v), v ]
            }
        })
        return parseInt(obj[tmp.sort( (a,b) => b[0] - a[0] )[0][1]])
    }

    function dumpDashBoard(names, div, cnt) {
        let npis = 'Svět'
        if (div === 'corona_dboard_eu') {
            npis = 'Evropa'
        }
        document.getElementById(div).innerHTML = `<h3>${npis}</h3>`
        const dumpTmp = []
        Object.keys(names).forEach(v => {
            const sel_confirmed = confirmed.filter(row => row['Country/Region'] === v)
            const sel_deaths = deaths.filter(row => row['Country/Region'] === v)
            const sel_recovered = recovered.filter(row => row['Country/Region'] === v)

            const sum_confirmed = sel_confirmed.map(row => getLastVal(row)).reduce((a, b) => a + b, 0)
            const sum_deaths = sel_deaths.map(row => getLastVal(row)).reduce((a, b) => a + b, 0)
            const sum_recovered = sel_recovered.map(row => getLastVal(row)).reduce((a, b) => a + b, 0)

            dumpTmp.push([names[v], sum_confirmed, sum_deaths, sum_recovered])
        })

        if (cnt === -1) {
            cnt = dumpTmp.length
        }

        dumpTmp.sort((row1, row2) => row2[1] - row1[1]).splice(0, cnt).forEach(txtRow => {
            document.getElementById(div).innerHTML += `<p><b>${txtRow[0]}</b><br>Nakažených: ${txtRow[1]}, mrtvých: ${txtRow[2]}, zotavených: ${txtRow[3]}</p>`
        })

        if (cnt < dumpTmp.length) { // odkaz na rozbaleni
            document.getElementById(div).innerHTML += `<p><a id="corona_dump_all_${div}" href="#/">Ukázat všechny</a></p>`
            document.getElementById(`corona_dump_all_${div}`).onclick = () => dumpDashBoard(names, div, -1)
        }    
    }

    function niceDate(ugly) {
        const dParts = ugly.split('T')[0].split('-')
        const tParts = ugly.split('T')[1].split('Z')[0].split(':')
        return `${parseInt(dParts[2])}. ${parseInt(dParts[1])}. v ${parseInt(tParts[0]) + 1}:${dParts[1]}`
    }
    
    fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
        .then((response) => response.text())
        .then((data) => {
            confirmed = d3.csvParse(data)

            fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv')
                .then((response) => response.text())
                .then((data) => {
                    deaths = d3.csvParse(data)

                    fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv')
                        .then((response) => response.text())
                        .then((data) => {
                            recovered = d3.csvParse(data)

                            // celková čísla
                            document.getElementById('corona_sum_conf').innerText = confirmed.map(v => getLastVal(v)).reduce((a, b) => a + b, 0)
                            document.getElementById('corona_sum_deaths').innerText = deaths.map(v => getLastVal(v)).reduce((a, b) => a + b, 0)
                            document.getElementById('corona_sum_recov').innerText = recovered.map(v => getLastVal(v)).reduce((a, b) => a + b, 0)

                            // EU státy
                            dumpDashBoard(euNames, 'corona_dboard_eu', 5)
                            // svet
                            dumpDashBoard(cNames, 'corona_dboard_world', 5)

                            // last update
                            fetch('https://api.github.com/repos/CSSEGISandData/COVID-19/commits?path=csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
                                .then((response) => response.json())
                                .then((data) => {
                                    document.getElementById('corona_stats_updated').innerHTML = 'Aktualizováno ' + niceDate(data[0].commit.committer.date) + ', <a target="_blank" href="https://github.com/CSSEGISandData/COVID-19">Johns Hopkins CSSE</a>'
                                })
                        })
                })
        })
})()



