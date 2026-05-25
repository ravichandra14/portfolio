/* ==========================================================================
   DEVELOPER PORTFOLIO JAVASCRIPT INTERACTIONS
   Author: Ravi Chandra
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. LIGHT / DARK THEME TOGGLE
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme in localStorage, otherwise check system preferences
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        body.className = savedTheme;
    } else {
        // Default to dark theme as it matches developer branding, else check system preference
        if (systemPrefersDark) {
            body.className = 'dark-theme';
        } else {
            body.className = 'light-theme';
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        }
    });

    /* 2. DYNAMIC TYPEWRITER EFFECT
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    const words = [
        "Full Stack Developer",
        "Competitive Programmer",
        "Problem Solver",
        "Computer Science Student"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Delete faster
        } else {
            // Add character
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Normal typing speed
        }

        // Handle word completion / erasure
        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at the end of word
            typingSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Brief pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typewriter if element exists
    if (typewriterElement) {
        setTimeout(type, 1000);
    }

    /* 3. SCROLL PROGRESS BAR & NAV SCROLLED STYLING
       ========================================================================== */
    const scrollBar = document.getElementById('scroll-bar');
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        // Update Scroll Bar Width
        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScrollHeight > 0) {
            const scrollPercent = (window.pageYOffset / totalScrollHeight) * 100;
            scrollBar.style.width = `${scrollPercent}%`;
        }

        // Update Header Background Style on Scroll
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* 4. MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    // Toggle menu
    mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('active');
        mobileToggle.classList.toggle('active');
        mobileDrawer.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileDrawer.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside the drawer
    document.addEventListener('click', (event) => {
        if (!mobileDrawer.contains(event.target) && 
            !mobileToggle.contains(event.target) && 
            mobileDrawer.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            mobileDrawer.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });

    /* 5. INTERSECTION OBSERVER FOR ACTIVE NAVBAR LINKS
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the sweet spot of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Update Desktop Nav Links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });

                // Update Mobile Drawer Links
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* 6. SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Reveal slightly before it enters the viewport fully
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* 7. PROJECTS SECTION FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and add to this one
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const projectCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || projectCategory === filterValue) {
                    card.classList.remove('fade-out');
                } else {
                    card.classList.add('fade-out');
                }
            });
        });
    });

    /* 8. CONTACT FORM WITH FLOATING LABELS & VALIDATION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent standard page reload

            // Basic validation check
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
                showFeedback('Please fill out all fields.', 'error');
                return;
            }

            // Display loading state on button
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Message... <i class="fa-solid fa-circle-notch fa-spin"></i>';

            // Simulate form submission (e.g. to Formspree or custom handler)
            setTimeout(() => {
                // Success Scenario
                showFeedback(`Thank you, ${nameInput.value}! Your message has been sent successfully.`, 'success');
                
                // Clear the form
                contactForm.reset();
                
                // Reset Button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
            }, 1800); // 1.8s delay to feel responsive
        });
    }

    function showFeedback(message, type) {
        formFeedback.textContent = message;
        formFeedback.className = `form-feedback ${type}`;
        formFeedback.classList.remove('hidden');

        // Scroll slightly to feedback message if on mobile
        if (window.innerWidth < 768) {
            formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Automatically hide success feedback after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formFeedback.classList.add('hidden');
                formFeedback.className = 'form-feedback hidden';
            }, 5000);
        }
    }
});
