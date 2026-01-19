document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('current-time');
    const profileImg = document.getElementById('profile-img');
    const profilePlaceholder = document.getElementById('profile-placeholder');
    const fileInput = document.getElementById('file-input');
    const picContainer = document.getElementById('pic-container');

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

    // Save on input
    fields.forEach(field => {
        const el = document.getElementById(`field-${field}`);
        el.addEventListener('input', () => {
            localStorage.setItem(`mDowod_${field}`, el.innerText);
        });
    });
});
