// ===== SOCIAL MEDIA BAR FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function () {

    const socialBarToggle = document.querySelector('.social-bar-toggle');
    const socialBarLinks = document.querySelector('.social-bar-links');

    if (!socialBarToggle || !socialBarLinks) return;

    // Toggle social icons
    socialBarToggle.addEventListener('click', function (e) {
        e.stopPropagation();

        socialBarLinks.classList.toggle('show');
        socialBarToggle.classList.toggle('active');
    });

    // Close when clicking a social icon
    document.querySelectorAll('.social-bar-links a').forEach(link => {
        link.addEventListener('click', function () {
            socialBarLinks.classList.remove('show');
            socialBarToggle.classList.remove('active');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
        if (
            !socialBarToggle.contains(e.target) &&
            !socialBarLinks.contains(e.target)
        ) {
            socialBarLinks.classList.remove('show');
            socialBarToggle.classList.remove('active');
        }
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            socialBarLinks.classList.remove('show');
            socialBarToggle.classList.remove('active');
        }
    });

});