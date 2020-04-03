(function() {
    fetch('https://api.apify.com/v2/key-value-stores/K373S4uCFR9W1K8ei/records/LATEST?disableRedirect=true')
        .then((response) => response.json())
        .then((data) => {
            const dte = data.lastUpdatedAtSource.split('T')[0].split('-')
            const hr = data.lastUpdatedAtSource.split('T')[1].split(':')
            
            if ( (document.getElementById('status_cz_testovani').innerText === '') | (parseInt(document.getElementById('status_cz_testovani').innerText) < data.totalTested) ) {
                document.getElementById('status_cz_testovani').innerText = data.totalTested
            }

            if ( (document.getElementById('status_cz_nakazeni').innerText === '') | (parseInt(document.getElementById('status_cz_nakazeni').innerText) < data.infected) ) {
                document.getElementById('status_cz_nakazeni').innerText = data.infected
            }

            if ( (document.getElementById('status_cz_vyleceni').innerText === '') | (parseInt(document.getElementById('status_cz_vyleceni').innerText) < data.recovered) ) {
                document.getElementById('status_cz_vyleceni').innerText = data.recovered
            }

            if ( (document.getElementById('status_cz_zemreli').innerText === '') | (parseInt(document.getElementById('status_cz_zemreli').innerText) < data.deceased) ) {
                document.getElementById('status_cz_zemreli').innerText = data.deceased
            }
            document.getElementById('status_cz_update').innerText = `${parseInt(dte[2])}. ${parseInt(dte[1])}. v ${parseInt(hr[0])}:${hr[1]}`
    })

    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pub?gid=0&single=true&output=csv')
        .then((response) => response.text())
        .then((data) => {
            const d = d3.csvParse(data.split('\n').slice(5,).join('\n'))
            const wrld = d.find(e => e['WORLD'] === 'TOTAL')
            // celková čísla svět
            try {
                document.getElementById('status_all_nakazeni').innerText = wrld.Cases.replace(',', '')
                document.getElementById('status_all_zemreli').innerText = wrld.Deaths.replace(',', '')
                document.getElementById('status_all_vyleceni').innerText = wrld.Recovered.replace(',', '')
            } catch(err) { return }
        })
})()



