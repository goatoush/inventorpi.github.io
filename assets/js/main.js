document.addEventListener("DOMContentLoaded", function () {
    
    // Select all links inside the main content area
    var links = document.querySelectorAll('.main-content a');
    
    links.forEach(function(link) {
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
        if (link.nextElementSibling && link.nextElementSibling.tagName === "EM" && link.nextElementSibling.innerHTML.trim() !== "") {
            link.setAttribute("data-title", link.nextElementSibling.innerHTML);
        }
    }
    });

    // Initialize GLightbox
    const lightbox = GLightbox({ selector: '.glightbox' });
    lightbox.on('open', () => {
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
});
});
