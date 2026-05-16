var params = new URLSearchParams(window.location.search);

// Persistence logic
if (!params.toString()) {
    const saved = localStorage.getItem('mobywatel_user_data');
    if (saved) {
        window.location.replace(window.location.pathname + '?' + saved);
    }
}

// Obsługa kliknięcia przycisku login
document.querySelector(".login").addEventListener('click', () => {
    checkPin();
});

// Funkcja weryfikacji PINu
function checkPin() {
    const inputField = document.querySelector(".password_input");
    // 'original' to zmienna przechowująca faktycznie wpisane znaki (zdefiniowana niżej)
    if (original === "2137") {
        toHome();
    } else {
        alert("Błędny PIN! Spróbuj ponownie.");
        // Reset pola
        inputField.value = "";
        original = "";
    }
}

// Powitanie w zależności od godziny i imienia
var welcome = "Dzień dobry!";
var date = new Date();
if (date.getHours() >= 18){
    welcome = "Dobry wieczór!";
}
const userName = params.get('name');
if (userName) {
    welcome += ` ${userName}!`;
}
document.querySelector(".welcome").innerHTML = welcome;

// Funkcja przekierowania do home.html z parametrami
function toHome(){
    location.href = 'home.html?' + params.toString();
}

// Obsługa Enter w polu hasła
var input = document.querySelector(".password_input");
input.addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        checkPin();
        document.activeElement.blur();
    }
});

// Logika maskowania hasła
var dot = "•";
var original = "";
var eye = document.querySelector(".eye");

input.addEventListener("input", () => {
    var value = input.value.toString();
    var char = value.substring(value.length - 1);

    if (value.length < original.length){
        original = original.substring(0, original.length - 1);
    } else {
        if (char !== dot) original = original + char;
    }

    if (!eye.classList.contains("eye_close")){
        var dots = "";
        for (var i = 0; i < original.length - 1; i++){
            dots += dot;
        }
        input.value = (original.length > 0) ? (dots + original.slice(-1)) : "";

        // Maskowanie ostatniego znaku po chwili
        setTimeout(() => {
            if (input.value.length !== 0 && !eye.classList.contains("eye_close")){
                let masked = "";
                for(let i=0; i<original.length; i++) masked += dot;
                input.value = masked;
            }
        }, 1000);
    }
});

// Przełącznik oka
eye.addEventListener('click', () => {
    var classlist = eye.classList;
    if (classlist.contains("eye_close")){
        classlist.remove("eye_close");
        let dots = "";
        for(let i=0; i<original.length; i++) dots += dot;
        input.value = dots;
    } else {
        classlist.add("eye_close");
        input.value = original;
    }
});

// --- PANEL ADMINA ---
let clickCount = 0;
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            window.location.href = 'admin.html';
        }
        setTimeout(() => { clickCount = 0; }, 3000);
    });
}
