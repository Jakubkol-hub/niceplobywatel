
var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    if (selector.classList.contains("selector_open")) {
        selector.classList.remove("selector_open")
    } else {
        selector.classList.add("selector_open")
    }
})

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown")
    })
})

var sex = "m"

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    })
})

var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {

    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    })

});

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown")
});

imageInput.addEventListener('change', (event) => {
    var file = imageInput.files[0];
    if (!file) return;

    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    // Create a temporary URL for the file to avoid massive base64 overhead
    var tempUrl = URL.createObjectURL(file);

    // Compress image before saving to localStorage
    compressImage(tempUrl, 1024, 0.7, (compressedUrl) => {
        // Clean up the object URL
        URL.revokeObjectURL(tempUrl);

        if (!compressedUrl) {
            alert("Nie udało się przetworzyć zdjęcia. Spróbuj ponownie lub wybierz inne zdjęcie.");
            upload.classList.remove("upload_loading");
            return;
        }

        try {
            // Store in localStorage for persistence across pages
            localStorage.setItem("uploadedImage", compressedUrl);

            upload.classList.remove("error_shown");
            upload.setAttribute("selected", "local"); // Store 'local' instead of full data
            upload.classList.add("upload_loaded");
            upload.classList.remove("upload_loading");
            upload.querySelector(".upload_uploaded").src = compressedUrl;
        } catch (err) {
            console.error("Storage error:", err);
            alert("Zdjęcie po kompresji jest nadal zbyt duże dla pamięci przeglądarki. Spróbuj wybrać mniejsze zdjęcie.");
            upload.classList.remove("upload_loading");
        }
    });

})

function compressImage(src, maxWidth, quality, callback) {
    var img = new Image();
    img.src = src;

    img.onload = function () {
        try {
            var canvas = document.createElement('canvas');
            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxWidth) {
                    width *= maxWidth / height;
                    height = maxWidth;
                }
            }

            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Export as compressed JPEG
            var newDataUrl = canvas.toDataURL('image/jpeg', quality);
            callback(newDataUrl);
        } catch (e) {
            console.error("Compression error:", e);
            callback(null);
        }
    };

    img.onerror = function () {
        console.error("Image load error");
        callback(null);
    };
}

document.querySelector(".go").addEventListener('click', () => {

    var empty = [];

    var params = new URLSearchParams();

    params.set("sex", sex)
    if (!upload.hasAttribute("selected")) {
        empty.push(upload);
        upload.classList.add("error_shown")
    } else {
        params.set("image", "local")
    }

    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday = birthday + "." + element.value
        if (isEmpty(element.value)) {
            dateEmpty = true;
        }
    })

    birthday = birthday.substring(1);

    if (dateEmpty) {
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    } else {
        params.set("birthday", birthday)
    }

    document.querySelectorAll(".input_holder").forEach((element) => {

        var input = element.querySelector(".input");

        if (isEmpty(input.value)) {
            empty.push(element);
            element.classList.add("error_shown");
        } else {
            params.set(input.id, input.value)
        }

    })

    if (empty.length != 0) {
        empty[0].scrollIntoView();
    } else {

        forwardToId(params);
    }

});

function isEmpty(value) {

    let pattern = /^\s*$/
    return pattern.test(value);

}

function forwardToId(params) {

    location.href = "id.html?" + params

}

var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {

    if (guide.classList.contains("unfolded")) {
        guide.classList.remove("unfolded");
    } else {
        guide.classList.add("unfolded");
    }

})





































































































































































































































































































































































































































