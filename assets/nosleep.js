// --- Global Hybrid Screen Wake Lock Implementation ---
var wakeLock = null;
var videoNoSleep = null;

// Function to request modern Wake Lock
var requestWakeLock = function () {
    if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen').then(function (lock) {
            wakeLock = lock;
            console.log("Wake Lock API active");
        }).catch(function (err) {
            console.log("Wake Lock API error: " + err.message);
        });
    }
};

// Function for Video-based Wake Lock (fallback for Xiaomi/Android)
var startVideoWakeLock = function () {
    if (!videoNoSleep) {
        videoNoSleep = document.createElement('video');
        videoNoSleep.setAttribute('loop', '');
        videoNoSleep.setAttribute('muted', '');
        videoNoSleep.setAttribute('playsinline', '');
        videoNoSleep.style.position = 'fixed';
        videoNoSleep.style.top = '0';
        videoNoSleep.style.left = '0';
        videoNoSleep.style.width = '1px';
        videoNoSleep.style.height = '1px';
        videoNoSleep.style.opacity = '0.01';
        videoNoSleep.style.pointerEvents = 'none';

        // Blank video data
        videoNoSleep.src = 'data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDJpc29tYXZjMQAAAZptb292AAAAbG12aGQAAAAA36YmXN+mJlwAAAPoAAAAKAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAGWlveHl0cmFrAAAAXHRraGQAAAAB36YmXN+mJlwAAAABAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAbBtZGlhAAAAIG1kaGQAAAAA36YmXN+mJlwAAAPoAAAAKABV bG5nuAAAADhoZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAE0c3RibAAAALhzdHNkAAAAAAAAAAEAAACmYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAoACgAWAABAEAhAAAALWF2Y0MBQsAs/+EAFWdCwCxYAt7A7uAiAQABAQAAAwAKAAAL9AABBAAFAf/hAByWAAAAAAAAAAZiZjYAAAAAAAAAAZJpcHAAAABMc3R0cwAAAAAAAAABAAAAAQAAACgAAABMc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAKAAAAAEAAAAYc3RjbwAAAAAAAAABAAAAMAAAAG91ZHRhAAAAW21ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXIAAAAAAAAAAAAAAAAAAAAALmlsc3QAAAAnqXRvbwAAAB9kYXRhAAAAAQAAAABMYXZmNTguMjkuMTAw';

        document.body.appendChild(videoNoSleep);
    }

    videoNoSleep.play().catch(function (e) {
        console.warn("Video wake lock failed: ", e);
    });
};

// Activate on first user interaction
var activateGlobalWakeLock = function () {
    requestWakeLock();
    startVideoWakeLock();
    document.removeEventListener('click', activateGlobalWakeLock);
    document.removeEventListener('touchstart', activateGlobalWakeLock);
};

document.addEventListener('click', activateGlobalWakeLock);
document.addEventListener('touchstart', activateGlobalWakeLock);

// Handle visibility change
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        if (wakeLock !== null) requestWakeLock();
        if (videoNoSleep !== null) videoNoSleep.play();
    }
});
