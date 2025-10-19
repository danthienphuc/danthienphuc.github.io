// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Active navigation on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
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

// Add scroll animation for tool cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all tool cards
document.addEventListener('DOMContentLoaded', () => {
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        observer.observe(card);
    });

    // Initialize reveal contact buttons
    initRevealContact();
});

// Reveal Contact Information (Security Feature)
function initRevealContact() {
    const revealButtons = document.querySelectorAll('.reveal-contact');
    
    revealButtons.forEach(button => {
        button.addEventListener('click', function() {
            const encoded = this.getAttribute('data-encoded');
            const type = this.getAttribute('data-type');
            
            if (!encoded) return;
            
            // Decode the contact info
            const decoded = atob(encoded);
            
            // Create appropriate link based on type
            let link;
            if (type === 'zalo') {
                link = document.createElement('a');
                link.href = `https://zalo.me/${decoded}`;
                link.className = 'contact-btn revealed';
                link.target = '_blank';
                link.innerHTML = `
                    <span class="btn-text">${formatPhone(decoded)}</span>
                    <span class="btn-icon">✓</span>
                `;
                
                // Add click to copy functionality
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    copyToClipboard(decoded);
                    // Then open Zalo
                    setTimeout(() => {
                        window.open(this.href, '_blank');
                    }, 500);
                });
            } else if (type === 'email') {
                link = document.createElement('a');
                link.href = `mailto:${decoded}`;
                link.className = 'contact-btn revealed';
                link.innerHTML = `
                    <span class="btn-text">${decoded}</span>
                    <span class="btn-icon">✓</span>
                `;
                
                // Add click to copy functionality
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    copyToClipboard(decoded);
                    // Then open email client
                    setTimeout(() => {
                        window.location.href = this.href;
                    }, 500);
                });
            }
            
            // Replace button with link
            this.parentNode.replaceChild(link, this);
            
            // Add animation
            link.style.opacity = '0';
            link.style.transform = 'scale(0.9)';
            setTimeout(() => {
                link.style.transition = 'all 0.3s ease';
                link.style.opacity = '1';
                link.style.transform = 'scale(1)';
            }, 10);
        });
    });
}

// Format phone number for display
function formatPhone(phone) {
    // Remove any spaces or special characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as: 0899 900 910
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return phone;
}

// Copy to clipboard with notification
function copyToClipboard(text) {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification('Đã copy: ' + text);
        }).catch(() => {
            // Fallback to old method
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification('Đã copy: ' + text);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
    
    document.body.removeChild(textarea);
}

// Show copy notification
function showCopyNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.copy-notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}