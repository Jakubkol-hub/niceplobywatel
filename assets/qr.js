
var error = document.querySelector(".error");
var actions = document.querySelectorAll(".action");

actions.forEach((element, index) => {
    element.addEventListener('click', () => {
        if (index === 0) {
            window.location.href = "scan.html";
        } else if (index === 1) {
            window.location.href = "verifier.html";
        } else {
            error.classList.add("error_open");
        }
    });
});

document.querySelectorAll(".close").forEach((element) => {
    element.addEventListener('click', () => {
        error.classList.remove("error_open");
    })
})