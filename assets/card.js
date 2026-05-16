
var confirmElement = document.querySelector(".confirm");

function closePage(){
  clearClassList();
}

function openPage(page){
  clearClassList();
  var classList = confirmElement.classList;
  classList.add("page_open");
  classList.add("page_" + page + "_open");
}

function clearClassList(){
  var classList = confirmElement.classList;
  classList.remove("page_open");
  classList.remove("page_1_open");
  classList.remove("page_2_open");
  classList.remove("page_3_open");
}

var time = document.getElementById("time");
var options = { year: 'numeric', month: 'numeric', day: '2-digit' };
var optionsTime = { second: 'numeric', minute: 'numeric', hour: '2-digit' };

if (localStorage.getItem("update") == null){
  localStorage.setItem("update", "21.05.2025")
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
function setClock(){
    date = new Date();
    time.innerHTML = "Czas: " + date.toLocaleTimeString("pl-PL", optionsTime) + " " + date.toLocaleDateString("pl-PL", options);    
    delay(1000).then(() => {
        setClock();
    })
}

var unfold = document.querySelector(".info_holder");
unfold.addEventListener('click', () => {

  if (unfold.classList.contains("unfolded")){
    unfold.classList.remove("unfolded");
  }else{
    unfold.classList.add("unfolded");
  }

})

var data = {}

var params = new URLSearchParams(window.location.search);
for (var key of params.keys()){
  data[key] = params.get(key);
}

document.querySelector(".id_own_image").style.backgroundImage = `url(${data['image']})`;

var birthday = data['birthday'];
var birthdaySplit = birthday.split(".");
var day = parseInt(birthdaySplit[0]);
var month = parseInt(birthdaySplit[1]);
var year = parseInt(birthdaySplit[2]);

var birthdayDate = new Date();
birthdayDate.setDate(day)
birthdayDate.setMonth(month-1)
birthdayDate.setFullYear(year)

birthday = birthdayDate.toLocaleDateString("pl-PL", options);

var sex = data['sex'];

if (sex === "m"){
  sex = "Mężczyzna"
}else if (sex === "k"){
  sex = "Kobieta"
}

setData("name", data['name']?.toUpperCase() || "");
setData("surname", data['surname']?.toUpperCase() || "");
setData("nationality", data['nationality']?.toUpperCase() || "POLSKIE");
setData("birthday", birthday);
setData("familyName", data['family_name'] || "");
setData("sex", sex);
setData("fathersFamilyName", data['father_family_name'] || "");
setData("mothersFamilyName", data['mother_family_name'] || "");
setData("birthPlace", data['birthPlace'] || "");
setData("countryOfBirth", data['birth_country'] || "");
setData("adress", "ul. " + (data['address1'] || "") + "<br>" + (data['address2'] || "") + " " + (data['city'] || ""));

setData("mdowSeries", data['mdow_series'] || "MWYC 24561");
setData("expiryDate", data['expiry_date'] || "14.07.2028");
setData("issueDate", data['issue_date'] || "14.07.2023");
setData("fatherName", data['father_name'] || "Maciej");
setData("motherName", data['mother_name'] || "Ewa");

document.querySelector(".home_date").innerHTML = data['home_date'] || localStorage.getItem("homeDate") || "";

if (data['pesel']) {
  setData("pesel", data['pesel']);
} else {
  if (parseInt(year) >= 2000){
    month = 20 + month;
  }
  
  var later;
  if (sex.toLowerCase() === "mężczyzna"){
    later = "0295"
  }else{
    later = "0382"
  }
  
  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;
  
  var pesel = year.toString().substring(2) + month + day + later + "7";
  setData("pesel", pesel);
}

function setData(id, value){

  document.getElementById(id).innerHTML = value;

}

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

// Activate bottom nav tab from query param ?tab=home|services|qr|more
(function(){
  try{
    var tab = (new URLSearchParams(window.location.search).get('tab')||'home').toLowerCase();
    var valid = ['home','services','qr','more'];
    if (!valid.includes(tab)) tab = 'home';
    var imgs = document.querySelectorAll('.bottom_element_image');
    var texts = document.querySelectorAll('.bottom_element_text');
    var openClasses = ['home_open','services_open','qr_open','more_open'];
    imgs.forEach(function(img){ openClasses.forEach(c=>img.classList.remove(c)); });
    texts.forEach(function(t){ t.classList.remove('open'); });
    document.querySelectorAll('.bottom_element_grid').forEach(function(el){
      var send = el.getAttribute('send');
      var img = el.querySelector('.bottom_element_image');
      var txt = el.querySelector('.bottom_element_text');
      if (send===tab){ if(img) img.classList.add(tab+'_open'); if(txt) txt.classList.add('open'); }
    });
  }catch(e){}
})();
