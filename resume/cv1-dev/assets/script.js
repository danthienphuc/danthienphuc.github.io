// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be fully loaded
$(document).ready(function() {
    console.log('CV loaded successfully!');
    
    // Set initial visibility
    $('.cv-container').css('opacity', '1');
    
    // Initialize animations
    initAnimations();
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Add interactive effects
    addInteractiveEffects();
});

/**
 * Initialize GSAP animations
 */
function initAnimations() {
    // Ensure all elements are visible first
    gsap.set('.profile-section, .profile-image-wrapper, .left-column .section, .right-column .section', {
        opacity: 1,
        clearProps: 'all'
    });
    
    // Optional: Simple fade in animation (disabled by default)
    // Uncomment below to enable subtle animations
    /*
    gsap.from('.profile-section', {
        duration: 0.6,
        opacity: 0,
        y: -20,
        ease: 'power2.out'
    });

    gsap.from('.profile-image-wrapper', {
        duration: 0.6,
        scale: 0.95,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.2
    });

    gsap.from('.left-column .section', {
        duration: 0.5,
        opacity: 0,
        x: -20,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3
    });

    gsap.from('.right-column .section', {
        duration: 0.5,
        opacity: 0,
        y: 15,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
    });
    */
}

/**
 * Add smooth scrolling behavior
 */
function addSmoothScrolling() {
    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        
        if(target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 800, 'easeInOutCubic');
        }
    });
}

/**
 * Add interactive effects
 */
function addInteractiveEffects() {
    // Skill tag hover effect with GSAP
    $('.skill-tag').on('mouseenter', function() {
        gsap.to($(this), {
            duration: 0.3,
            scale: 1.1,
            y: -3,
            ease: 'power2.out'
        });
    }).on('mouseleave', function() {
        gsap.to($(this), {
            duration: 0.3,
            scale: 1,
            y: 0,
            ease: 'power2.out'
        });
    });

    // Experience item hover effect
    $('.experience-item').on('mouseenter', function() {
        gsap.to($(this), {
            duration: 0.3,
            x: 5,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            ease: 'power2.out'
        });
    }).on('mouseleave', function() {
        gsap.to($(this), {
            duration: 0.3,
            x: 0,
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            ease: 'power2.out'
        });
    });

    // Project item hover effect
    $('.project-item').on('mouseenter', function() {
        gsap.to($(this), {
            duration: 0.3,
            scale: 1.02,
            ease: 'power2.out'
        });
    }).on('mouseleave', function() {
        gsap.to($(this), {
            duration: 0.3,
            scale: 1,
            ease: 'power2.out'
        });
    });

    // Tech tag click effect - pulse animation
    $('.tech-tag').on('click', function() {
        const tag = $(this);
        gsap.to(tag, {
            duration: 0.1,
            scale: 0.95,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    });

    // Certificate hover effect
    $('.certificate-list li').on('mouseenter', function() {
        gsap.to($(this).find('i'), {
            duration: 0.3,
            rotation: 360,
            scale: 1.2,
            ease: 'back.out(1.7)'
        });
    }).on('mouseleave', function() {
        gsap.to($(this).find('i'), {
            duration: 0.3,
            rotation: 0,
            scale: 1,
            ease: 'power2.out'
        });
    });

    // Profile image rotation on hover
    $('.profile-image-wrapper').on('mouseenter', function() {
        gsap.to($(this), {
            duration: 0.5,
            rotation: 5,
            scale: 1.05,
            ease: 'power2.out'
        });
    }).on('mouseleave', function() {
        gsap.to($(this), {
            duration: 0.5,
            rotation: 0,
            scale: 1,
            ease: 'power2.out'
        });
    });

    // Section title animation on hover
    $('.section-title').on('mouseenter', function() {
        gsap.to($(this).find('i'), {
            duration: 0.3,
            x: 5,
            ease: 'power2.out'
        });
    }).on('mouseleave', function() {
        gsap.to($(this).find('i'), {
            duration: 0.3,
            x: 0,
            ease: 'power2.out'
        });
    });
}

/**
 * Parallax effect on scroll - Disabled for better performance
 */
// $(window).on('scroll', function() {
//     const scrolled = $(window).scrollTop();
//     const parallaxSpeed = 0.5;
//     
//     // Parallax for left column
//     $('.left-column').css('transform', 'translateY(' + (scrolled * parallaxSpeed) + 'px)');
// });

/**
 * Print functionality with custom styling
 */
window.onbeforeprint = function() {
    console.log('Preparing to print CV...');
};

window.onafterprint = function() {
    console.log('Print completed or cancelled');
};

/**
 * Add loading animation
 */
$(window).on('load', function() {
    console.log('CV fully loaded');
});

/**
 * Add scroll progress indicator
 */
function addScrollProgress() {
    const progressBar = $('<div class="scroll-progress no-print"></div>');
    $('body').append(progressBar);
    
    $(window).on('scroll', function() {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height() - $(window).height();
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.css('width', scrollPercent + '%');
    });
}

// Initialize scroll progress
addScrollProgress();

// Add CSS for scroll progress
$('<style>')
    .text(`
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            z-index: 9999;
            transition: width 0.2s ease;
        }
    `)
    .appendTo('head');