// Service Worker Registration for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => {
                console.log('Service Worker zarejestrowany pomyślnie.');
            })
            .catch(err => {
                console.log('Błąd podczas rejestracji Service Workera:', err);
            });
    });
}

// Opcjonalnie: Obsługa przycisku instalacji (jeśli chcesz dodać przycisk w UI)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('Aplikacja gotowa do instalacji.');
});