document.addEventListener("DOMContentLoaded", function () {

    let glightboxLoaded = false;

    const initLazyGLightbox = (clickedElement) => {
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
    const images = document.querySelectorAll(".main-content img");

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
});
