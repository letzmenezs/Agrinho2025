document.addEventListener('DOMContentLoaded', function() {
    // --- Initializing Splitting.js for heading animations ---
    Splitting();

    // --- Smooth Scrolling for Navigation Links with Offset ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const offset = targetElement.offsetTop - navbarHeight - 20; // Adjusted offset for padding below navbar
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu after clicking a link
            const navLinks = document.querySelector('.nav-links');
            const burger = document.querySelector('.burger-menu');
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                burger.classList.remove('toggle');
                // Reset animation for mobile menu items
                document.querySelectorAll('.nav-links li').forEach(item => {
                    item.style.animation = '';
                });
            }
        });
    });

    // --- Toggle Mobile Menu & Animate Menu Items ---
    window.toggleMenu = function() {
        const navLinks = document.querySelector('.nav-links');
        const burger = document.querySelector('.burger-menu');
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');

        // Animate nav links sequentially
        const navItems = document.querySelectorAll('.nav-links li');
        navItems.forEach((item, index) => {
            if (navLinks.classList.contains('nav-active')) {
                item.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            } else {
                item.style.animation = ''; // Reset animation
            }
        });
    }

    // --- Sticky Navbar & Active Link Highlighting on Scroll ---
    const navbar = document.querySelector(".navbar");
    const sections = document.querySelectorAll("section");

    const activateNavbarFeatures = () => {
        // Sticky Navbar
        if (window.pageYOffset >= 100) { // Activate sticky after 100px scroll
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }

        // Active link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 50; // More aggressive offset for active state
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(currentSectionId)) {
                a.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateNavbarFeatures);
    // Initial call to set active link and sticky state on load
    activateNavbarFeatures();

    // --- Animate Numbers on Scroll (Intersection Observer for Stats Section) ---
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.getElementById('stats');
    let countersAnimated = false;

    const statsObserverOptions = {
        threshold: 0.6 // Trigger when 60% of the section is visible
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                counters.forEach(counter => {
                    const target = +counter.dataset.target;
                    const suffix = counter.nextElementSibling ? counter.nextElementSibling.textContent : ''; // Get the suffix like '%'
                    let current = 0;
                    const duration = 2000; // milliseconds
                    const start = performance.now();

                    const updateCounter = (timestamp) => {
                        const elapsed = timestamp - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const value = Math.floor(progress * target);

                        counter.textContent = value;
                        if (suffix) counter.textContent += suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target; // Ensure it ends exactly on target
                            if (suffix) counter.textContent += suffix;
                        }
                    };
                    requestAnimationFrame(updateCounter);
                });
                countersAnimated = true;
                observer.unobserve(entry.target);
            }
        });
    }, statsObserverOptions);

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // --- Testimonial Carousel with Auto-Play and Pause on Hover ---
    let slideIndex = 1;
    let autoSlideInterval;

    function showSlides(n) {
        let slides = document.getElementsByClassName("testimonial-item");
        let dots = document.getElementsByClassName("dot");

        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        slides[slideIndex-1].style.display = "block";
        dots[slideIndex-1].className += " active";
    }

    // Function to start automatic slide show
    function startAutoSlide() {
        autoSlideInterval = setInterval(function() {
            showSlides(++slideIndex);
        }, 8000); // Change slide every 8 seconds
    }

    // Initial display and start auto-play
    showSlides(slideIndex);
    startAutoSlide();

    // Expose for HTML onclick for manual navigation
    window.currentSlide = function(n) {
        clearInterval(autoSlideInterval); // Clear auto-play on manual click
        showSlides(slideIndex = n);
        startAutoSlide(); // Restart auto-play after manual click
    }

    // Pause auto-play on carousel hover
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    if (testimonialCarousel) {
        testimonialCarousel.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        testimonialCarousel.addEventListener('mouseleave', startAutoSlide);
    }

    // --- Scroll Reveal Animations for Sections ---
    const scrollRevealSections = document.querySelectorAll('.scroll-reveal');

    const revealObserverOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the section is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add a class to trigger CSS animations
                entry.target.querySelectorAll('.animate__animated').forEach(el => {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                });
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealObserverOptions);

    scrollRevealSections.forEach(section => {
        revealObserver.observe(section);
    });

    // --- Simple Audio Feedback for Buttons (Optional, use with caution for UX) ---
    // const playClickSound = () => {
    //     const audio = new Audio('path/to/click.mp3'); // Replace with your sound file
    //     audio.play();
    // };
    // document.querySelectorAll('button, a.btn-primary').forEach(el => {
    //     el.addEventListener('click', playClickSound);
    // });

    // --- Parallax effect on hero section (Optional) ---
    // window.addEventListener('scroll', () => {
    //     const scrollY = window.scrollY;
    //     const heroContent = document.querySelector('.hero-content');
    //     heroContent.style.transform = `translateY(${scrollY * 0.4}px)`; // Adjust speed
    // });
});
