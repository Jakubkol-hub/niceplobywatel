
var confirmElement = document.querySelector(".confirm");

function closePage() {
  clearClassList();
}

function openPage(page) {
  clearClassList();
  var classList = confirmElement.classList;
  classList.add("page_open");
  classList.add("page_" + page + "_open");
}

function clearClassList() {
  var classList = confirmElement.classList;
  classList.remove("page_open");
  classList.remove("page_1_open");
  classList.remove("page_2_open");
  classList.remove("page_3_open");
}

var time = document.getElementById("time");
var options = { year: 'numeric', month: 'numeric', day: 'numeric' };

if (localStorage.getItem("update") == null) {
  localStorage.setItem("update", "24.12.2024")
}

var date = new Date();

var updateText = document.querySelector(".bottom_update_value");
updateText.innerHTML = localStorage.getItem("update");

var update = document.querySelector(".update");
update.addEventListener('click', () => {
  var newDate = date.toLocaleDateString("pl-PL", options);
  localStorage.setItem("update", newDate);
  updateText.innerHTML = newDate;

  scroll(0, 0)
});

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

setClock();
function setClock() {
  date = new Date()
  time.innerHTML = "Czas: " + date.toLocaleTimeString() + " " + date.toLocaleDateString("pl-PL", options);
  delay(1000).then(() => {
    setClock();
  })
}

var unfold = document.querySelector(".info_holder");
unfold.addEventListener('click', () => {

  if (unfold.classList.contains("unfolded")) {
    unfold.classList.remove("unfolded");
  } else {
    unfold.classList.add("unfolded");
  }

})

var data = {}

var params = new URLSearchParams(window.location.search);

// Fallback to localStorage if no params in URL
if (params.toString() === "") {
  var rawData = localStorage.getItem("persistentData");
  if (rawData) {
    try {
      var savedData = JSON.parse(rawData);
      data = {
        sex: savedData.sex || "m",
        image: "local",
        birthday: (savedData.dates || []).join("."),
        name: savedData.name || "",
        surname: savedData.surname || "",
        nationality: savedData.nationality || "",
        familyName: savedData.familyName || "",
        fathersFamilyName: savedData.fathersFamilyName || "",
        mothersFamilyName: savedData.mothersFamilyName || "",
        birthPlace: savedData.birthPlace || "",
        countryOfBirth: savedData.countryOfBirth || "",
        adress1: savedData.adress1 || "",
        adress2: savedData.adress2 || "",
        city: savedData.city || ""
      };
    } catch (e) {
      console.error("Error loading data in card.js:", e);
    }
  }
} else {
  for (var key of params.keys()) {
    data[key] = params.get(key);
  }
}

var imageUrl = data['image'];
if (imageUrl === "local" || !imageUrl) {
  imageUrl = localStorage.getItem("uploadedImage");
}

document.querySelector(".id_own_image").style.backgroundImage = `url(${imageUrl})`;

var birthday = data['birthday'] || "01.01.2000";
var birthdaySplit = birthday.split(".");
var day = parseInt(birthdaySplit[0]) || 1;
var month = parseInt(birthdaySplit[1]) || 1;
var year = parseInt(birthdaySplit[2]) || 2000;

var birthdayDate = new Date();
birthdayDate.setDate(day)
birthdayDate.setMonth(month - 1)
birthdayDate.setFullYear(year)

birthday = birthdayDate.toLocaleDateString("pl-PL", options);

var sex = data['sex'] || "m";

if (sex === "m") {
  sex = "Mężczyzna"
} else if (sex === "k") {
  sex = "Kobieta"
}

setData("name", (data['name'] || "").toUpperCase());
setData("surname", (data['surname'] || "").toUpperCase());
setData("nationality", (data['nationality'] || "").toUpperCase());
setData("birthday", birthday);
setData("familyName", data['familyName'] || "");
setData("sex", sex);
setData("fathersFamilyName", data['fathersFamilyName'] || "");
setData("mothersFamilyName", data['mothersFamilyName'] || "");
setData("birthPlace", data['birthPlace'] || "");
setData("countryOfBirth", data['countryOfBirth']);
setData("adress", "ul. " + data['adress1'] + "<br>" + data['adress2'] + " " + data['city']);

if (localStorage.getItem("homeDate") == null) {
  var homeDay = getRandom(1, 25);
  var homeMonth = getRandom(0, 12);
  var homeYear = getRandom(2012, 2019);

  var homeDate = new Date();
  homeDate.setDate(homeDay);
  homeDate.setMonth(homeMonth);
  homeDate.setFullYear(homeYear)

  localStorage.setItem("homeDate", homeDate.toLocaleDateString("pl-PL", options))
}

document.querySelector(".home_date").innerHTML = localStorage.getItem("homeDate")

if (parseInt(year) >= 2000) {
  month = 20 + month;
}

var later;

if (sex.toLowerCase() === "mężczyzna") {
  later = "0295"
} else {
  later = "0382"
}

if (day < 10) {
  day = "0" + day
}

if (month < 10) {
  month = "0" + month
}

var pesel = year.toString().substring(2) + month + day + later + "7";
setData("pesel", pesel)

function setData(id, value) {

  document.getElementById(id).innerHTML = value;

}

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}
