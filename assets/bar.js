
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