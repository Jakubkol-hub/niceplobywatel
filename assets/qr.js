
var error = document.querySelector(".error");
var errorDescription = document.querySelector(".error_description");
var actions = document.querySelectorAll(".action");

const errorMessages = [
    "Wygląda na to, że wersja aplikacji jest za stara. Zaktualizuj aplikację, aby kontynuować.",
    "Wygląda na to, że wystąpił błąd, spróbuj ponownie później.",
    "Błąd połączenia z serwerem. Sprawdź swoje połączenie z internetem."
];

actions.forEach((element, index) => {
    element.addEventListener('click', () => {
        // Pick a random error message or use specific ones
        const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        errorDescription.innerText = randomMessage;
        error.classList.add("error_open");
    });
});

document.querySelectorAll(".close").forEach((element) => {
    element.addEventListener('click', () => {
        error.classList.remove("error_open");
    })
})