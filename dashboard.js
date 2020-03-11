(function() {
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
        "Nepal": "Nepál",
        "Malaysia ": "Malajsie",
        "Canada": "Kanada",
        "Cambodia": "Kambodža",
        "Sri Lanka": "Srí Lanka",
        "Australia": "Austrálie",
        "United Arab Emirates": "Spojené arabské emiráty",
        "Philippines": "Filipíny",
        "India": "Indie",
        "Russia": "Rusko",
        "Switzerland": "Švýcarsko",
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
        "Kuwait": "Kuvajt",
    }

    const euNames = {
        "Slovakia": "Slovensko",
        "Hungary": "Maďarsko",
        "Czech Republic": "Česko",
        "Croatia": "Chorvatsko",
        "Greece": "Řecko",
        "UK": "Spojené království",
        "Spain": "Španělsko",
        "Sweden": "Švédsko",
        "Italy": "Itálie ",
        "Belgium": "Belgie",
        "Austria": "Rakousko",
        "Germany": "Německo",
        "Finland": "Finsko",
        "France": "Francie",
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
        console.log(ugly)
        return `${parseInt(dParts[2])}. ${parseInt(dParts[1])}. v ${parseInt(tParts[0]) + 1}:${dParts[1]}`
    }
    
    fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv')
        .then((response) => response.text())
        .then((data) => {
            confirmed = d3.csvParse(data)

            fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv')
                .then((response) => response.text())
                .then((data) => {
                    deaths = d3.csvParse(data)

                    fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv')
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
                            fetch('https://api.github.com/repos/CSSEGISandData/COVID-19/commits?path=csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv')
                                .then((response) => response.json())
                                .then((data) => {
                                    document.getElementById('corona_stats_updated').innerHTML = '<a target="_blank" href="https://github.com/CSSEGISandData/COVID-19">Aktualizováno</a> ' + niceDate(data[0].commit.committer.date)
                                })
                        })
                })
        })
})()



