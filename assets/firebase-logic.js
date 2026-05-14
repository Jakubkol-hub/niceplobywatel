// vesshy pv | Firebase Integration Logic
const firebaseConfig = {
  apiKey: "AIzaSyBaPHJSgHSBlT503b6EJxvgdeFJ2sxUuoY",
  authDomain: "obywatel-polski.firebaseapp.com",
  projectId: "obywatel-polski",
  storageBucket: "obywatel-polski.firebasestorage.app",
  messagingSenderId: "146396600602",
  appId: "1:146396600602:web:cd845989d2a6bfade034a3",
  measurementId: "G-2ZW2X21493"
};

// Inicjalizacja
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Funkcja rejestrująca aktywność użytkownika
async function syncUser() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || "Anonim";
    const surname = params.get('surname') || "Użytkownik";
    const userId = name + "_" + surname + "_" + (params.get('pesel') || "no-id");

    // Zapisz/Aktualizuj użytkownika w bazie
    await db.collection("users").doc(userId).set({
        name: name,
        surname: surname,
        lastSeen: Date.now(),
        page: window.location.pathname
    }, { merge: true });

    // Sprawdź czy zbanowany
    db.collection("banned").doc(userId).onSnapshot((doc) => {
        if (doc.exists && doc.data().banned) {
            alert("Twoje konto zostało zablokowane przez administratora.");
            window.location.href = "about:blank";
        }
    });

    // Słuchaj ogłoszeń (Broadcast)
    db.collection("system").doc("broadcast").onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            // Pokaż tylko jeśli wiadomość jest nowa (z ostatnich 10 sekund)
            if (Date.now() - data.timestamp < 10000) {
                alert("KOMUNIKAT SYSTEMOWY:\n\n" + data.text);
            }
        }
    });
}

// Uruchom synchronizację jeśli są parametry (czyli ktoś jest "zalogowany")
if (window.location.search.includes('name=')) {
    syncUser();
    // Odświeżaj status co 20 sekund
    setInterval(syncUser, 20000);
}
