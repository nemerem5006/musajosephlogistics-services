document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconHamburger = document.getElementById('icon-hamburger');
    const iconClose = document.getElementById('icon-close');

    if (mobileMenuButton && mobileMenu && iconHamburger && iconClose) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            iconHamburger.classList.toggle('hidden');
            iconClose.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', mobileMenu.classList.contains('hidden') ? 'false' : 'true');
        });
    }

    // 2. Set Current Year in Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 3. Hero Carousel (index.html specific)
    const heroCarousel = document.getElementById('hero-carousel');
    if (heroCarousel) {
        const slides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
        const prevButton = document.getElementById('hero-prev');
        const nextButton = document.getElementById('hero-next');
        const dotsContainer = document.getElementById('hero-dots');
        let currentIndex = 0;
        let slideInterval;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-white/50', 'hover:bg-white', 'transition-colors', 'duration-300');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.remove('opacity-100', 'z-10');
                slide.classList.add('opacity-0');
                if (i === index) {
                    slide.classList.add('opacity-100', 'z-10');
                }
            });
            dots.forEach((dot, i) => {
                dot.classList.remove('bg-white');
                dot.classList.add('bg-white/50');
                if (i === index) {
                    dot.classList.add('bg-white');
                    dot.classList.remove('bg-white/50');
                }
            });
        };

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            showSlide(currentIndex);
            resetInterval();
        };

        const nextSlide = () => goToSlide(currentIndex + 1);
        const prevSlide = () => goToSlide(currentIndex - 1);

        if (prevButton) prevButton.addEventListener('click', prevSlide);
        if (nextButton) nextButton.addEventListener('click', nextSlide);

        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        showSlide(currentIndex);
        startInterval();
    }

    // 4. Partners Carousel (index.html specific)
    const partnersCarouselWrapper = document.getElementById('partners-carousel-wrapper');
    const partnersCarouselTrack = document.getElementById('partners-carousel-track');
    const partnersPrevButton = document.getElementById('partners-prev');
    const partnersNextButton = document.getElementById('partners-next');

    if (partnersCarouselWrapper && partnersCarouselTrack && partnersPrevButton && partnersNextButton) {
        // Scroll amount is set to the width of the wrapper to scroll by a full "page" of logos
        const scrollAmount = partnersCarouselWrapper.offsetWidth;

        const updateScrollPosition = (direction) => {
            if (direction === 'next') {
                partnersCarouselTrack.scrollLeft += scrollAmount;
            } else {
                partnersCarouselTrack.scrollLeft -= scrollAmount;
            }
            updateButtons();
        };

        const updateButtons = () => {
            // Add a small tolerance for floating point inaccuracies when checking scroll position
            const tolerance = 1; 
            partnersPrevButton.disabled = partnersCarouselTrack.scrollLeft <= tolerance;
            partnersNextButton.disabled = partnersCarouselTrack.scrollLeft + partnersCarouselWrapper.offsetWidth >= partnersCarouselTrack.scrollWidth - tolerance;
        };

        partnersNextButton.addEventListener('click', () => updateScrollPosition('next'));
        partnersPrevButton.addEventListener('click', () => updateScrollPosition('prev'));

        // Initial button state
        updateButtons();
        // Update buttons on scroll (e.g., if user manually scrolls with mouse/trackpad)
        partnersCarouselTrack.addEventListener('scroll', updateButtons);
        // Update buttons on window resize
        window.addEventListener('resize', updateButtons);
    }

    // 5. Tracking Form (tracking.html specific)
    const trackingForm = document.getElementById('trackingForm');
    const trackingNumberInput = document.getElementById('trackingNumber');
    const trackingResultsDiv = document.getElementById('trackingResults');
    const trackingErrorDiv = document.getElementById('trackingError');
    const resultTrackingId = document.getElementById('resultTrackingId');
    const resultStatus = document.getElementById('resultStatus');
    const resultLastUpdate = document.getElementById('resultLastUpdate');
    const resultEstDelivery = document.getElementById('resultEstDelivery');
    const resultHistory = document.getElementById('resultHistory');
    const trackingSubmitButton = trackingForm ? trackingForm.querySelector('button[type="submit"]') : null;

    if (trackingForm && trackingNumberInput && trackingResultsDiv && trackingErrorDiv &&
        resultTrackingId && resultStatus && resultLastUpdate && resultEstDelivery && resultHistory && trackingSubmitButton) {

        trackingForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            const trackingNumber = trackingNumberInput.value.trim();

            // Hide previous results/errors
            trackingResultsDiv.classList.add('hidden');
            trackingErrorDiv.classList.add('hidden');
            
            // Provide user feedback
            trackingSubmitButton.disabled = true;
            trackingSubmitButton.textContent = 'Tracking...';

            try {
                // Make API call to our Node.js server
                const response = await fetch(`http://localhost:3000/api/track/${trackingNumber}`);

                if (response.ok) {
                    const data = await response.json();
                    resultTrackingId.textContent = data.id;
                    resultStatus.textContent = data.status;
                    resultLastUpdate.textContent = data.lastUpdate;
                    resultEstDelivery.textContent = data.estimatedDelivery;

                    resultHistory.innerHTML = ''; // Clear previous history
                    data.history.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        resultHistory.appendChild(li);
                    });

                    trackingResultsDiv.classList.remove('hidden');
                } else {
                    // Handle 404 Not Found and other server errors
                    trackingErrorDiv.classList.remove('hidden');
                }
            } catch (error) {
                // Handle network errors (e.g., server is down)
                console.error('Error fetching tracking data:', error);
                trackingErrorDiv.classList.remove('hidden'); // Show error
            } finally {
                // Restore button state
                trackingSubmitButton.disabled = false;
                trackingSubmitButton.textContent = 'Track';
            }
        });
    }

    // 6. Contact Form (contact.html specific)
    const contactForm = document.getElementById('contactForm');
    const formSubmissionMessage = document.getElementById('form-submission-message');
    const contactSubmitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    if (contactForm && formSubmissionMessage && contactSubmitButton) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            // Provide user feedback
            contactSubmitButton.disabled = true;
            contactSubmitButton.textContent = 'Sending...';
            formSubmissionMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700');
            formSubmissionMessage.classList.add('bg-blue-100', 'text-blue-700');
            formSubmissionMessage.textContent = 'Sending message...';

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
            };

            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    formSubmissionMessage.classList.remove('bg-blue-100', 'text-blue-700', 'bg-red-100', 'text-red-700');
                    formSubmissionMessage.classList.add('bg-green-100', 'text-green-700');
                    formSubmissionMessage.textContent = 'Message sent successfully! We will get back to you shortly.';
                    contactForm.reset(); // Clear the form fields on success
                } else {
                    throw new Error('Server responded with an error.');
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
                formSubmissionMessage.classList.remove('bg-blue-100', 'text-blue-700', 'bg-green-100', 'text-green-700');
                formSubmissionMessage.classList.add('bg-red-100', 'text-red-700');
                formSubmissionMessage.textContent = 'Failed to send message. Please try again later.';
            } finally {
                formSubmissionMessage.classList.remove('hidden');
                contactSubmitButton.disabled = false;
                contactSubmitButton.textContent = 'Send Message';
            }
        });
    }
});
                    formSubmissionMessage.classList.remove('bg-blue-100', 'text-blue-700', 'bg-green-100', 'text-green-700');
                    formSubmissionMessage.classList.add('bg-red-100', 'text-red-700');
                    formSubmissionMessage.textContent = 'Failed to send message. Please try again later.';
                }
                formSubmissionMessage.classList.remove('hidden'); // Ensure message is visible
            }, 1500); // Simulate 1.5 seconds delay
        });
    }
});