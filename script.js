// Navigation Toggle Logic
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Auto-Animation Logic (Scroll-Reveal without HTML changes)
const initScrollAnimations = () => {
    // Select sections and cards based on existing structure
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.project-card, .skill-category, .timeline-item, .achievement-column, .contact-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Prepare sections for reveal
    sections.forEach(section => {
        if (section.id !== 'home') { // Don't hide the hero section
            section.classList.add('section-reveal');
            observer.observe(section);
        }
    });

    // Prepare cards for staggered reveal
    cards.forEach((card, index) => {
        card.classList.add('stagger-reveal');
        // Add a slight delay based on index for items in the same container
        card.style.transitionDelay = `${(index % 3) * 0.15}s`;
        observer.observe(card);
    });
};

// Initialize everything on load
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    
    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
