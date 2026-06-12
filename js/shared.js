// ===== SHARED JAVASCRIPT FOR ALL PAGES =====

// Initialize AOS
AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100,
    delay: 100
});

// ===== CUSTOM CURSOR WITH LERP EFFECT =====
const cursor = document.createElement('div');
cursor.className = 'cursor-dot';
document.body.appendChild(cursor);

const cursorOutline = document.createElement('div');
cursorOutline.className = 'cursor-outline';
document.body.appendChild(cursor.parentNode.insertBefore(cursorOutline, cursor));

let cursorX = 0;
let cursorY = 0;
let outlineX = 0;
let outlineY = 0;
let isMouseMoving = false;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px)`;
    isMouseMoving = true;
});

// Lerp animation for outline
function updateCursorOutline() {
    outlineX += (cursorX - outlineX) * 0.15;
    outlineY += (cursorY - outlineY) * 0.15;
    cursorOutline.style.transform = `translate(${outlineX - 15}px, ${outlineY - 15}px)`;
    
    if (isMouseMoving) {
        requestAnimationFrame(updateCursorOutline);
    }
}

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorOutline.style.opacity = '1';
    isMouseMoving = true;
    updateCursorOutline();
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorOutline.style.opacity = '0';
    isMouseMoving = false;
});

// Make cursor bigger on interactive elements
document.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'A' || 
        e.target.tagName === 'BUTTON' || 
        e.target.classList.contains('service-card') ||
        e.target.classList.contains('gallery-card') ||
        e.target.classList.contains('blog-card') ||
        e.target.classList.contains('testimonial-card') ||
        e.target.closest('a') ||
        e.target.closest('button')) {
        cursorOutline.classList.add('cursor-active');
    }
});

document.addEventListener('mouseout', (e) => {
    cursorOutline.classList.remove('cursor-active');
});

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Scroll Effect
const header = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Progress Bar
const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    if (progressBar) progressBar.style.width = scrolled + '%';
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn?.classList.add('show');
    } else {
        scrollTopBtn?.classList.remove('show');
    }
});

scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== FOLLOW US SIDEBAR =====
const followUsToggle = document.querySelector('.follow-us-toggle');
const followUsSidebar = document.querySelector('.follow-us-sidebar');

if (followUsToggle) {
    followUsToggle.addEventListener('click', () => {
        followUsSidebar.classList.toggle('show');
    });

    // Close when clicking a link
    document.querySelectorAll('.follow-us-links a').forEach(link => {
        link.addEventListener('click', () => {
            followUsSidebar.classList.remove('show');
        });
    });
}

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (followUsSidebar && !followUsSidebar.contains(e.target) && !followUsToggle?.contains(e.target)) {
        followUsSidebar.classList.remove('show');
    }
});

// Console branding
console.log(
    '%c🦷 Swarna Dental Care',
    'color: #6366f1; font-size: 20px; font-weight: bold;'
);
console.log(
    '%cPowered by PowerCloud 🚀',
    'color: #10b981; font-size: 12px;'
);
