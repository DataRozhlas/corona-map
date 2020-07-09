(function() {
    function getLastVal(obj) {
        const tmp = Object.keys(obj).map(v => {
            if (v.indexOf('/20') > -1) {
                return [Date.parse(v), v ]
            }
        })
        return parseInt(obj[tmp.sort( (a,b) => b[0] - a[0] )[0][1]])
    }

    fetch('https://data.irozhlas.cz/covid-uzis/nakazeni-vyleceni-umrti-testy.json')
        .then((response) => response.json())
        .then((dt) => {
            const dte = dt.modified.split('T')[0].split('-')
            const hr =  dt.modified.split('T')[1].split(':')	//"2020-05-06T10:49:36+0200"
            const tday = dt.data[dt.data.length - 1]
            
            if ( (document.getElementById('status_cz_testovani').innerText === '') | (parseInt(document.getElementById('status_cz_testovani').innerText) < tday.kumulovany_pocet_provedenych_testu) ) {
                document.getElementById('status_cz_testovani').innerText = tday.kumulovany_pocet_provedenych_testu
            }

            if ( (document.getElementById('status_cz_nakazeni').innerText === '') | (parseInt(document.getElementById('status_cz_nakazeni').innerText) < tday.kumulovany_pocet_nakazenych) ) {
                document.getElementById('status_cz_nakazeni').innerText = tday.kumulovany_pocet_nakazenych
            }

            if ( (document.getElementById('status_cz_vyleceni').innerText === '') | (parseInt(document.getElementById('status_cz_vyleceni').innerText) < tday.kumulovany_pocet_vylecenych) ) {
                document.getElementById('status_cz_vyleceni').innerText = tday.kumulovany_pocet_vylecenych
            }

            if ( (document.getElementById('status_cz_zemreli').innerText === '') | (parseInt(document.getElementById('status_cz_zemreli').innerText) < tday.kumulovany_pocet_umrti) ) {
                document.getElementById('status_cz_zemreli').innerText = tday.kumulovany_pocet_umrti
            }

            if (document.getElementById('status_cz_nemocni')) {
                if ( (document.getElementById('status_cz_nemocni').innerText === '') | (parseInt(document.getElementById('status_cz_nemocni').innerText) < tday.kumulovany_pocet_umrti) ) {
                    document.getElementById('status_cz_nemocni').innerText = tday.kumulovany_pocet_nakazenych - tday.kumulovany_pocet_vylecenych - tday.kumulovany_pocet_umrti
                }
            }

            document.getElementById('status_cz_update').innerText = `${parseInt(dte[2])}. ${parseInt(dte[1])}. v ${parseInt(hr[0])}:${hr[1]}`
    })

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
                            document.getElementById('status_all_nakazeni').innerText = confirmed.map(v => getLastVal(v)).reduce((a, b) => a + b, 0)
                            document.getElementById('status_all_zemreli').innerText = deaths.map(v => getLastVal(v)).reduce((a, b) => a + b, 0)
                            document.getElementById('status_all_vyleceni').innerText = recovered.map(v => getLastVal(v)).reduce((a, b) => a + b, 0)
                        })
                    })
                })
})()



