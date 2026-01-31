
var params = new URLSearchParams(window.location.search);

function sendTo(url) {
    const rawData = localStorage.getItem("persistentData");
    if (rawData) {
        try {
            const data = JSON.parse(rawData);
            params.set("sex", data.sex || "m");
            params.set("image", "local");
            params.set("birthday", (data.dates || []).join("."));
            params.set("name", data.name || "");
            params.set("surname", data.surname || "");
            params.set("nationality", data.nationality || "");
            params.set("familyName", data.familyName || "");
            params.set("fathersFamilyName", data.fathersFamilyName || "");
            params.set("mothersFamilyName", data.mothersFamilyName || "");
            params.set("birthPlace", data.birthPlace || "");
            params.set("countryOfBirth", data.countryOfBirth || "");
            params.set("adress1", data.adress1 || "");
            params.set("adress2", data.adress2 || "");
            params.set("city", data.city || "");
        } catch (e) {
            console.error("Error syncing data in bar.js:", e);
        }
    }
    location.href = `${url}.html?` + params.toString();
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