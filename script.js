// Navigation Toggle Logic for Mobile Overlay Menu
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    });
});

// Navbar scroll styling effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active Navigation Link Tracking on Scroll
const initActiveNav = () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Triggers when section covers screen center
        threshold: 0
    };
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
};

// Scroll Reveal Animations
const initAnimations = () => {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.querySelectorAll('.reveal, .fade-in').forEach(el => {
                    el.classList.add('active');
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        if (section.id !== 'home') {
            section.classList.add('reveal');
            observer.observe(section);
        }
    });
};

// Interactive Mouse-Responsive Particle Constellation Canvas
const initLiveBackground = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'live-bg';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleCount = 70;
    let connectionDistance = 110;
    
    // Track mouse position in hero section
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    hero.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    const resize = () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        if (canvas.width < 768) {
            particleCount = 30;
            connectionDistance = 80;
        } else {
            particleCount = 70;
            connectionDistance = 110;
        }
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = 'rgba(99, 102, 241, 0.35)'; // Accent Indigo color
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
                this.reset();
                if (Math.random() > 0.5) {
                    this.x = this.speedX > 0 ? 0 : canvas.width;
                } else {
                    this.y = this.speedY > 0 ? 0 : canvas.height;
                }
            }
            
            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (mouse.radius - distance) / mouse.radius;
                    // Gently pull towards mouse
                    this.x += forceDirectionX * force * 0.5;
                    this.y += forceDirectionY * force * 0.5;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const init = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw constellation lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    let alpha = (1 - (distance / connectionDistance)) * 0.12;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    };

    init();
    animate();
};

// Clipboard Copy-to-Clipboard Functionality
const initCopyToClipboard = () => {
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                btn.classList.add('copied');
                const icon = btn.querySelector('i');
                const originalClass = icon.className;
                icon.className = 'fas fa-check';
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    icon.className = originalClass;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });
};

// Interactive Contact Form (Validation & Visual Success state)
const initContactForm = () => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const messageInput = document.getElementById('form-message');
        const btn = form.querySelector('.btn-submit');
        const btnText = btn.querySelector('span');
        const btnIcon = btn.querySelector('i');
        
        // Validation
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            status.className = 'form-status error';
            status.textContent = 'Please fill in all fields.';
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            status.className = 'form-status error';
            status.textContent = 'Please enter a valid email address.';
            return;
        }
        
        // Disable submit button & show animation loaders
        status.textContent = '';
        btn.disabled = true;
        btnText.textContent = 'Sending...';
        btnIcon.className = 'fas fa-spinner fa-spin';
        
        // Simulate email sending API
        setTimeout(() => {
            status.className = 'form-status success';
            status.textContent = 'Thank you! Your message has been sent successfully.';
            
            // Re-enable and reset form
            btn.disabled = false;
            btnText.textContent = 'Send Message';
            btnIcon.className = 'fas fa-paper-plane';
            form.reset();
            
            // Clear message
            setTimeout(() => {
                status.textContent = '';
            }, 6000);
        }, 1800);
    });
};

// Initialization on DOM Content Load
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initLiveBackground();
    initActiveNav();
    initCopyToClipboard();
    initContactForm();

    // Smooth scroll for nav link anchor clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = 90; // Adjust spacing below floating navbar
                window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
});
