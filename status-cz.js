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
            document.getElementById('status_cz_update').innerText = `${parseInt(dte[2])}. ${parseInt(dte[1])}. v ${parseInt(hr[0]) + 1}:${hr[1]}`
    })
})()



