(function() {
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
            document.getElementById('status_cz_update').innerText = `${parseInt(dte[2])}. ${parseInt(dte[1])}. v ${parseInt(hr[0])}:${hr[1]}`
    })

    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pub?gid=0&single=true&output=csv')
        .then((response) => response.text())
        .then((data) => {
            const d = d3.csvParse(data.split('\n').slice(5,).join('\n'))
            const wrld = d.find(e => e['LOCATION'] === 'TOTAL')
            // celková čísla svět
            try {
                document.getElementById('status_all_nakazeni').innerText = wrld.Cases.replace(/,/g, '')
                document.getElementById('status_all_zemreli').innerText = wrld.Deaths.replace(/,/g, '')
                document.getElementById('status_all_vyleceni').innerText = wrld.Recovered.replace(/,/g, '')
            } catch(err) { return }
        })
})()



