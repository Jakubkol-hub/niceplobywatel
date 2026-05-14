var params = new URLSearchParams(window.location.search);
const STORAGE_KEY = 'mobywatel_user_data';

// Persistence logic: if no params in URL, try to load from localStorage
// We only skip index.html (the setup page)
const isSetupPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

if (!isSetupPage) {
    if (params.toString()) {
        localStorage.setItem(STORAGE_KEY, params.toString());
    } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            window.location.replace(window.location.pathname + '?' + saved);
        } else if (!window.location.pathname.endsWith('id.html')) {
            // No data and not on login page? Go back to setup
            window.location.href = 'index.html';
        }
    }
}
var ROUTES = {
    home: 'home.html',
    services: 'services.html',
    qr: 'qr.html',
    more: 'more.html',
    moreid: 'moreid.html',
    id: 'id.html',
    shortcuts: 'shortcuts.html',
    pesel: 'pesel.html',
    scanqr: 'scanqr.html',
    showqr: 'showqr.html',
    gen: 'gen.html',
    card: 'card.html',
};

function sendTo(key){
    var qs = params.toString();
    var file = ROUTES[String(key)] || (String(key).endsWith('.html') ? String(key) : String(key) + '.html');
    var href = file + (qs ? `?${qs}` : '');
    location.href = href;
}

// Prefetching for performance optimization on GitHub Pages
function prefetch(key) {
    const file = ROUTES[key] || (key.endsWith('.html') ? key : key + '.html');
    if (!document.querySelector(`link[href="${file}"]`)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = file;
        document.head.appendChild(link);
    }
}

document.querySelectorAll(".bottom_element_grid, [onclick^='sendTo']").forEach((element) => {
    // Prefetch on hover
    element.addEventListener('mouseenter', () => {
        const key = element.getAttribute("send") || element.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
        if (key) prefetch(key);
    });

    // Navigation logic
    element.addEventListener('click', (e) => {
        const key = element.getAttribute("send");
        if (key) {
            sendTo(key);
        }
    });
});

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
  
  if (getMobileOperatingSystem() == 2){
      document.querySelector(".bottom_bar").style.height = "70px"
}

// Admin Panel Trigger (5 clicks on emblem)
let adminClickCount = 0;
let adminClickTimeout;
// Try different selectors for the emblem across pages
const emblem = document.querySelector('.top_image') || document.querySelector('.logo') || document.querySelector('.main_page_logo');

if (emblem) {
    emblem.style.cursor = 'pointer'; // Make it feel clickable
    emblem.addEventListener('click', () => {
        adminClickCount++;
        clearTimeout(adminClickTimeout);
        
        if (adminClickCount === 5) {
            window.location.href = 'admin.html';
        }
        
        adminClickTimeout = setTimeout(() => {
            adminClickCount = 0;
        }, 3000);
    });
}