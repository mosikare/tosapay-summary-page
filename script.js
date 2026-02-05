// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Counter animation function
function animateCounter(element, targetValue, prefix = '', suffix = '', duration = 2000) {
    const startValue = 0;
    const startTime = performance.now();
    
    // Extract numeric value (remove commas, prefix, suffix)
    const numericValue = parseFloat(targetValue.toString().replace(/[^\d.]/g, ''));
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (numericValue - startValue) * easeOutQuart;
        
        // Format the number with commas
        let formattedValue = Math.floor(currentValue);
        if (formattedValue >= 1000) {
            formattedValue = formattedValue.toLocaleString('en-US');
        }
        
        // Update the element
        element.textContent = prefix + formattedValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Ensure final value is exact with proper formatting
            let finalValue = Math.floor(numericValue);
            if (finalValue >= 1000) {
                finalValue = finalValue.toLocaleString('en-US');
            }
            element.textContent = prefix + finalValue + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // If it's a stat card, animate the counter
            if (entry.target.classList.contains('stat-card')) {
                const statNumberElement = entry.target.querySelector('.stat-number');
                if (statNumberElement && !statNumberElement.dataset.animated) {
                    const originalText = statNumberElement.textContent.trim();
                    
                    // Extract prefix (like "R") - everything before the first digit
                    const prefixMatch = originalText.match(/^([^\d]*)/);
                    const prefix = prefixMatch ? prefixMatch[1] : '';
                    
                    // Extract suffix (like "+") - find last digit, then get everything after
                    let suffix = '';
                    for (let i = originalText.length - 1; i >= 0; i--) {
                        if (/\d/.test(originalText[i])) {
                            suffix = originalText.substring(i + 1);
                            break;
                        }
                    }
                    
                    // Mark as animated to prevent re-animation
                    statNumberElement.dataset.animated = 'true';
                    
                    // Start counter animation
                    animateCounter(statNumberElement, originalText, prefix, suffix, 2000);
                }
            }
        }
    });
}, observerOptions);

// Stats animation on scroll
document.querySelectorAll('.stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Observe feature cards and steps
document.querySelectorAll('.feature-card, .step, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
