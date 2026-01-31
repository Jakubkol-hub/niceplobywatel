
var params = new URLSearchParams(window.location.search);

function sendTo(url) {
    var newParams = new URLSearchParams();
    var rawData = localStorage.getItem("persistentData");
    if (rawData) {
        try {
            var data = JSON.parse(rawData);
            newParams.set("sex", data.sex || "m");
            newParams.set("image", "local");
            newParams.set("birthday", (data.dates || []).join("."));
            newParams.set("name", data.name || "");
            newParams.set("surname", data.surname || "");
            newParams.set("nationality", data.nationality || "");
            newParams.set("familyName", data.familyName || "");
            newParams.set("fathersFamilyName", data.fathersFamilyName || "");
            newParams.set("mothersFamilyName", data.mothersFamilyName || "");
            newParams.set("birthPlace", data.birthPlace || "");
            newParams.set("countryOfBirth", data.countryOfBirth || "");
            newParams.set("adress1", data.adress1 || "");
            newParams.set("adress2", data.adress2 || "");
            newParams.set("city", data.city || "");
        } catch (e) {
            console.error("Error syncing data in bar.js:", e);
        }
    }
    location.href = `${url}.html?` + newParams.toString();
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

if (getMobileOperatingSystem() == 2) {
    document.querySelector(".bottom_bar").style.height = "70px"
}

// --- Hybrid Screen Wake Lock Implementation ---
var wakeLock = null;
var videoNoSleep = null;

// Function to request modern Wake Lock
var requestWakeLock = function () {
    if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen').then(function (lock) {
            wakeLock = lock;
            console.log("Wake Lock is active");
        }).catch(function (err) {
            console.error("Wake Lock error: " + err.name + ", " + err.message);
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

        // Use a tiny base64 blank video to trigger wake lock
        videoNoSleep.src = 'data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDJpc29tYXZjMQAAAZptb292AAAAbG12aGQAAAAA36YmXN+mJlwAAAPoAAAAKAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAGWlveHl0cmFrAAAAXHRraGQAAAAB36YmXN+mJlwAAAABAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAbBtZGlhAAAAIG1kaGQAAAAA36YmXN+mJlwAAAPoAAAAKABV bG5nuAAAADhoZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAE0c3RibAAAALhzdHNkAAAAAAAAAAEAAACmYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAoACgAWAABAEAhAAAALWF2Y0MBQsAs/+EAFWdCwCxYAt7A7uAiAQABAQAAAwAKAAAL9AABBAAFAf/hAByWAAAAAAAAAAZiZjYAAAAAAAAAAZJpcHAAAABMc3R0cwAAAAAAAAABAAAAAQAAACgAAABMc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAKAAAAAEAAAAYc3RjbwAAAAAAAAABAAAAMAAAAG91ZHRhAAAAW21ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXIAAAAAAAAAAAAAAAAAAAAALmlsc3QAAAAnqXRvbwAAAB9kYXRhAAAAAQAAAABMYXZmNTguMjkuMTAw';

        document.body.appendChild(videoNoSleep);
    }

    videoNoSleep.play().catch(function (e) {
        console.warn("Video wake lock failed to play: ", e);
    });
};

// Most mobile browsers require a user interaction to start wake lock / video
var activateWakeLock = function () {
    requestWakeLock();
    startVideoWakeLock();
    // Remove listeners after first activation
    document.removeEventListener('click', activateWakeLock);
    document.removeEventListener('touchstart', activateWakeLock);
};

document.addEventListener('click', activateWakeLock);
document.addEventListener('touchstart', activateWakeLock);

// Re-request when app becomes visible again
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        if (wakeLock !== null) requestWakeLock();
        if (videoNoSleep !== null) videoNoSleep.play();
    }
});
