const vacStart = new Date(2020, 11, 27);
const vacEnd = new Date(2022, 05, 30);
const dnuVakcinace = Math.floor((new Date(2021, 0, 14) - vacStart)/86400000);
const dnuDoKonce = Math.floor((vacEnd - new Date())/86400000);
const planLidi = 6953849;
const planDavek = 11901700;
const pocitadlo = document.querySelector("#pocitadlo");
const davkyAplikovane = 70680;
const dnuDoSplneni = (planDavek - davkyAplikovane)/(davkyAplikovane/dnuVakcinace);
const pctHotovo = Math.round(davkyAplikovane/planDavek*1000)/1000;

const p1 = document.createElement("P"); 
p1.innerHTML = `Od začátku očkování v Česku uplynulo <strong>${Math.floor((new Date() - vacStart)/86400000)} dnů</strong>.`;
pocitadlo.appendChild(p1);

const p2 = document.createElement("P"); 
p2.innerHTML = `Podle posledních <a href="https://onemocneni-aktualne.mzcr.cz/covid-19" target="_blank"> oficiálních informací</a> od té doby zdravotníci aplikovali <strong>${davkyAplikovane.toLocaleString('cs')} dávek</strong> vakcíny. (Ministerstvo zdravotnictví data aktualizuje jednou týdně, poslední údaj je ze čtvrtka 14. ledna.)`;
pocitadlo.appendChild(p2);

const p3 = document.createElement("P"); 
p3.innerHTML = `To je v průměru <strong>${Math.floor(davkyAplikovane/dnuVakcinace).toLocaleString('cs')} dávek</strong> za den.`;
pocitadlo.appendChild(p3);

const p4 = document.createElement("P"); 
p4.innerHTML = `Podle vládní <a href="https://koronavirus.mzcr.cz/wp-content/uploads/2020/12/Strategie_ockovani_proti_covid-19_aktual_221220.pdf">Strategie očkování proti covid-19 v České republice</a> by mělo být v polovině roku 2022 naočkováno <strong>6,9 milionu lidí</strong>.`;
pocitadlo.appendChild(p4);

const p5 = document.createElement("P"); 
p5.innerHTML = `Potřeba k tomu bude <strong>11,9 milionu dávek</strong>. (Zhruba dva miliony lidí mají dostat vakcínu Jansen, která se skládá z jediné dávky. Ostatní by měli dostat dávky dvě.)`;
pocitadlo.appendChild(p5);

const p6 = document.createElement("P"); 
p6.innerHTML = `Aby se plán naplnil, bylo by potřeba každý den aplikovat průměrně <strong>${Math.floor((planDavek - davkyAplikovane)/dnuDoKonce).toLocaleString('cs')} dávek</strong>.`;
pocitadlo.appendChild(p6);

const p7 = document.createElement("P"); 
p7.innerHTML = `Dosavadním tempem by Česko cíle očkovací strategie dosáhlo za <strong>${Math.floor(dnuDoSplneni).toLocaleString('cs')} dnů</strong>, tj. <strong>${(new Date(Date.now() + dnuDoSplneni * 86400000)).toLocaleDateString('cs')}</strong>.`;
pocitadlo.appendChild(p7);

Highcharts.setOptions({
    lang: {
        shortMonths: [
            'led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'
        ],
        months: [
            'led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'
        ]
    }
});

Highcharts.ganttChart('progres', {
    title: {
        text: 'Jak postupuje očkování'
    },
    xAxis: {
        min: Date.UTC(2021, 0, 1),
        max: Date.UTC(2022, 5, 30)
    },

    series: [{
        name: '',
        data: [{
            name: 'počet dávek',
            start: Date.UTC(2020, 11, 27),
            end: Date.UTC(2022, 5, 30),
            completed: pctHotovo,
        }]
    }]
});


