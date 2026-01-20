document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('current-time');
    const profileImg = document.getElementById('profile-img');
    const profilePlaceholder = document.getElementById('profile-placeholder');
    const fileInput = document.getElementById('file-input');
    const godloInput = document.getElementById('godlo-input');
    const bgInput = document.getElementById('bg-input');
    const picContainer = document.getElementById('pic-container');
    const godloContainer = document.getElementById('godlo-container');
    const idCard = document.getElementById('id-card');

    function updateProfileImage(src) {
        if (src) {
            profileImg.src = src;
            profileImg.style.display = 'block';
            profilePlaceholder.style.display = 'none';
        } else {
            profileImg.style.display = 'none';
            profilePlaceholder.style.display = 'flex';
        }
    }

    // Update time continuously
    function updateTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('pl-PL');
        const timeStr = now.toLocaleTimeString('pl-PL');
        timeDisplay.innerText = `Czas: ${timeStr} ${dateStr}`;
    }

    setInterval(updateTime, 1000);
    updateTime();

    // Godło upload handling
    godloContainer.addEventListener('click', () => {
        godloInput.click();
    });

    godloInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgData = event.target.result;
                updateGodlo(imgData);
                localStorage.setItem('mDowod_godlo', imgData);
            };
            reader.readAsDataURL(file);
        }
    });

    function updateGodlo(imgData) {
        if (!imgData) return;
        const godloImg = document.getElementById('godlo-img');
        if (godloImg) {
            godloImg.src = imgData;
        }
    }

    // Background customization (double-click on card)
    idCard.addEventListener('dblclick', () => {
        bgInput.click();
    });

    bgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgData = event.target.result;
                idCard.style.backgroundImage = `url(${imgData})`;
                localStorage.setItem('mDowod_bg', imgData);
            };
            reader.readAsDataURL(file);
        }
    });

    // Image upload handling
    picContainer.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateProfileImage(event.target.result);
                localStorage.setItem('mDowod_pic', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Persistence logic
    const fields = ['names', 'surname', 'citizenship', 'birthdate', 'pesel'];

    // Load saved data
    fields.forEach(field => {
        const savedValue = localStorage.getItem(`mDowod_${field}`);
        if (savedValue) {
            document.getElementById(`field-${field}`).innerText = savedValue;
        }
    });

    const savedPic = localStorage.getItem('mDowod_pic');
    updateProfileImage(savedPic);

    const savedGodlo = localStorage.getItem('mDowod_godlo');
    if (savedGodlo) updateGodlo(savedGodlo);

    const savedBg = localStorage.getItem('mDowod_bg');
    if (savedBg) {
        if (savedBg.startsWith('linear-gradient') || savedBg.startsWith('rgb') || savedBg.startsWith('#')) {
            idCard.style.background = savedBg;
        } else {
            idCard.style.backgroundImage = `url(${savedBg})`;
        }
    }

    // Save on input
    fields.forEach(field => {
        const el = document.getElementById(`field-${field}`);
        el.addEventListener('input', () => {
            localStorage.setItem(`mDowod_${field}`, el.innerText);
        });
    });
});
