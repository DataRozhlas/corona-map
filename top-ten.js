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
        "Mainland China": "Pevninská Čína",
        "Iran": "Írán",
        "South Korea": "Jižní Korea",
        "United States": "USA",
        "Denmark*": "Dánsko",
        "Palestine": "Palestina",
        "Russia": "Rusko",
        "Bosnia": "Bosna",
        "Moldova": "Moldavsko",
        "Andorra": "Andora",
        "Vatican City": "Vatikán",
        "Turkey": "Turecko",
        "China": "Čína",
        "Korea, South": "Jižní Korea",
        "Taiwan*": "Taiwan",
        "Congo (Brazzaville)": "Kongo (Kinshasa)",
        "Republic of the Congo": "Konžská republika",
        "Germany": "Německo",
        "Lithuania": "Litva",
        "Iceland": "Island",
        "United Kingdom": "Spojené království",
        "Finland": "Finsko",
        "France": "Francie",
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

    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pub?gid=0&single=true&output=csv')
        .then((response) => response.text())
        .then((data) => {
            const d = d3.csvParse(data.split('\n').slice(5,).join('\n'))
            let dumpWrld = []
            d.forEach(v => {
                const cases = parseInt(v['Cases'].replace(',', '')) || 0
                const serious = parseInt(v['Serious & Critical'].replace(',', '')) || 0
                //const critical = parseInt(v['Critical'].replace(',', '')) || 0
                const deaths = parseInt(v['Deaths'].replace(',', '')) || 0
                const recovered = parseInt(v['Recovered'].replace(',', '')) || 0
                const country = v['LOCATION']

                dumpWrld.push([cNames[country] || country, cases, serious, deaths, recovered])
            })
            
            const omit = ['TOTAL', 'Queue', 'Diamond Princess']
            dumpWrld = dumpWrld.filter( val => !(omit.includes(val[0])) )
            let rows = ``
            dumpWrld.sort( (a, b) => b[1] - a[1]).slice(0, 10).forEach( (state, idx) => {
                rows += `<tr>
                            <td class="text-right">${idx + 1}.</td>
                            <td>${state[0]}</td>
                            <td class="text-right">${state[1]}</td>
                            <td class="text-right">${state[4]}</td>
                            <td class="text-right">${state[3]}</td>
                        </tr>`
            })
            document.getElementById('corona_top_10').innerHTML += `<tbody>${rows}</tbody>`
        })
    })()
