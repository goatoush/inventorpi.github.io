const testRtl = rtl => {
    if (rtl) {
        document.documentElement.setAttribute('dir', 'rtl');
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = '/assets/css/rtl.css';
        document.head.appendChild(linkElement);
    }
    else {
        document.documentElement.removeAttribute('dir');
    }
}

const detectUserLanguage = () => {
    const banner = document.querySelector('.language-banner');
    const dismissBtn = banner.querySelector('.dismiss.btn');
    const switchBtn = banner.querySelector('.switch.btn');
    const userLang = navigator.language || navigator.userLanguage;
    const match = languages.find((l) => l.c == userLang) || languages.find((l) => l.c == userLang.substring(0, 2));
    if (currentLang == 'en' && match && currentLang != match.c && !localStorage.getItem('hide_lang_banner')) {
        dismissBtn.textContent = 'Keep English';
        dismissBtn.addEventListener('click', () => {
            localStorage.setItem('hide_lang_banner', 'true');
            banner.style.display = 'none';
        });
        switchBtn.textContent = `Switch to ${match.l}`;
        switchBtn.addEventListener('click', () => {
            window.location.replace(`/${match.c}/${window.location.pathname}`);
        });
        banner.style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", function () {

    detectUserLanguage();

    window.glightboxLoaded = false;

    window.initLazyGLightbox = (clickedElement) => {
        if (glightboxLoaded) return;
        glightboxLoaded = true;

        // 1. Dynamically load the GLightbox CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css';
        document.head.appendChild(link);

        // 2. Dynamically load the GLightbox JS
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js';
        script.onload = () => {
            // 3. Initialize GLightbox once the script loads
            const lightbox = GLightbox({
                selector: '.glightbox'
            });
            lightbox.on('open', () => {
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            });
            lightbox.open(clickedElement); // Open immediately on the first click
        };
        document.body.appendChild(script);
    };

    // Select all links inside the main content area
    var links = document.querySelectorAll('.main-content a');

    links.forEach(function (link) {
        // Check if the link is external (starts with http/https)
        if (link.hostname !== window.location.hostname || link.href.includes(".pdf")) {
            link.setAttribute('target', '_blank');
        }
    });

    // Query all markdown content images
    const images = document.querySelectorAll(".main-content img:not(.inline-img)");

    images.forEach(img => {
        // Avoid double wrapping if it's already inside a link
        if (!img.parentElement.closest("a")) {
            const link = document.createElement("a");
            link.href = img.src;
            link.className = "glightbox";
            img.parentNode.insertBefore(link, img);
            link.appendChild(img);
            link.setAttribute("data-gallery", img.parentElement.closest(".slide") ? "slider" : "default");
            if (link.nextElementSibling && link.nextElementSibling.tagName === "EM" && link.nextElementSibling.innerHTML.trim() !== "") {
                link.setAttribute("data-title", link.nextElementSibling.innerHTML);
            }
            link.addEventListener('click', (e) => {
                // Prevent immediate navigation if using <a> tags
                if (!glightboxLoaded) {
                    e.preventDefault();
                    initLazyGLightbox(e.currentTarget);
                }
            });
        }
    });

    const menuButton = document.getElementById("menu-button");
    const backdrop = document.getElementById("nav-backdrop");

    menuButton.addEventListener("click", function () {
        setTimeout(function () {
            var isExpanded = menuButton.getAttribute("aria-expanded") === "true";
            if (isExpanded) {
                backdrop.classList.add("open");
            } else {
                backdrop.classList.remove("open");
            }
        }, 50);
    });

    backdrop.addEventListener("click", function () {
        menuButton.click();
        backdrop.classList.remove("open");
    });

    if (document.querySelector('.slider-container')) {
        setTimeout(() => {
            const sliderContainer = document.querySelector('.slider-container');
            const images = sliderContainer.getAttribute('data-images').split('|');
            const joinPath = (...parts) => parts.join('/');
            const imageFolder = joinPath('', 'assets', 'images', 'circuits', 'small');
            const sliderTrack = document.createElement('div');
            sliderTrack.className = 'slider-track';
            sliderContainer.appendChild(sliderTrack);
            images.concat(images).forEach((image) => {
                const slide = document.createElement('div');
                slide.className = 'slide';
                sliderTrack.appendChild(slide);
                const img = document.createElement('img');
                img.src = joinPath(imageFolder, image + '.webp');
                img.alt = image;
                img.loading = 'eager';
                const link = document.createElement('a');
                link.href = img.src;
                link.className = 'glightbox';
                slide.appendChild(link);
                link.appendChild(img);
                link.setAttribute('data-gallery', 'slider');
                link.setAttribute('data-title', image);
                link.addEventListener('click', (e) => {
                    if (!glightboxLoaded) {
                        e.preventDefault();
                        initLazyGLightbox(e.currentTarget);
                    }
                });
            });
        }, 1000);
    }


});
