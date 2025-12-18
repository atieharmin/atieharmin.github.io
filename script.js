// ============================================
// ATIEH ARMIN - PORTFOLIO SCRIPTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initRevealAnimations();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Scroll effect for nav
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initScrollEffects() {
    // Parallax effect for hero visual
    const heroVisual = document.querySelector('.hero-visual');
    const heroOrb = document.querySelector('.hero-orb');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = window.innerHeight;
        
        if (scrolled < heroHeight && heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
            if (heroOrb) {
                heroOrb.style.opacity = Math.max(0.6 - scrolled / heroHeight, 0);
            }
        }
    });

    // Scroll indicator fade
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
}

// ============================================
// REVEAL ANIMATIONS
// ============================================
function initRevealAnimations() {
    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.timeline-item, .research-card, .project-card, .skill-category, .contact-card, .highlight-card, .about-text'
    );
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    // Intersection Observer for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Add staggered delay for grid items
                const parent = entry.target.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Section title animations
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('reveal');
        revealObserver.observe(title);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// EASTER EGG - Console Message
// ============================================
console.log(`
%c👋 Hello, curious developer!
%cThis portfolio was crafted with care.
Interested in AI research? Let's connect!
`, 
'font-size: 16px; font-weight: bold; color: #d4a574;',
'font-size: 12px; color: #a1a1aa;'
);

