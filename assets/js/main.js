document.addEventListener("DOMContentLoaded", function () {

    // Select all links inside the main content area
    var links = document.querySelectorAll('.main-content a');
    
    links.forEach(function(link) {
    // Check if the link is external (starts with http/https)
    if (link.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer'); // Security best practice
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
    }
    });

    // Initialize GLightbox
    GLightbox({ selector: '.glightbox' });
});
