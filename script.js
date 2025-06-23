document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        const hamburgerIcon = document.getElementById('icon-hamburger');
        const closeIcon = document.getElementById('icon-close');

        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';

            mobileMenu.classList.toggle('hidden');
            menuButton.setAttribute('aria-expanded', !isExpanded);

            // Toggle icons if they exist
            if (hamburgerIcon && closeIcon) {
                hamburgerIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
            }
        });
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Helper function for simulating delay ---
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const messageDiv = document.getElementById('form-submission-message');
            const submitButton = contactForm.querySelector('button[type="submit"]');
            
            submitButton.disabled = true;
            messageDiv.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
            messageDiv.textContent = 'Sending...';
            messageDiv.classList.add('bg-blue-100', 'text-blue-700');
            messageDiv.classList.remove('hidden');

            await delay(1500); // Simulate network delay

            // Simulate success
            messageDiv.textContent = 'Thank you! Your message has been sent successfully.';
            messageDiv.classList.replace('bg-blue-100', 'bg-green-100');
            messageDiv.classList.replace('text-blue-700', 'text-green-700');
            contactForm.reset();
            
            await delay(5000); // Wait 5 seconds before hiding
            messageDiv.classList.add('hidden');
            submitButton.disabled = false;
        });
    }

    // --- Tracking Form Logic ---
    
    // Mock API function to fetch tracking data
    async function fetchTrackingData(trackingId) {
        console.log(`Simulating API call for: ${trackingId}`);
        await delay(1500); // Simulate network delay

        const mockDatabase = {
                    "MJ774116330": {
                        status: "In Transit",
                        lastUpdate: "2023-10-27 10:30 AM - Departed from Hub XYZ",
                        estimatedDelivery: "2023-10-29",
                        history: [
                            "2023-10-27 10:30 AM: Departed from Hub XYZ",
                            "2023-10-26 08:00 PM: Arrived at Hub XYZ",
                            "2023-10-26 02:00 PM: Picked up from sender"
                        ]
                    },
                    "LP987654321": {
                        status: "Delivered",
                        lastUpdate: "2023-10-25 02:15 PM - Delivered to recipient",
                        estimatedDelivery: "2023-10-25",
                        history: [
                            "2023-10-25 02:15 PM: Delivered to recipient",
                            "2023-10-25 09:00 AM: Out for delivery",
                            "2023-10-24 05:00 PM: Arrived at local facility"
                        ]
                    }
        };

        const data = mockDatabase[trackingId.toUpperCase()];
        if (data) {
            return data;
        } else {
            throw new Error("Tracking number not found.");
        }
    }

    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm) {
        trackingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const trackingNumberInput = document.getElementById('trackingNumber');
            const trackingResultsDiv = document.getElementById('trackingResults');
            const trackingErrorDiv = document.getElementById('trackingError');
            const submitButton = trackingForm.querySelector('button[type="submit"]');
            const trackingId = trackingNumberInput.value.trim();

            trackingResultsDiv.classList.add('hidden');
            trackingErrorDiv.classList.add('hidden');

            if (!trackingId) {
                alert('Please enter a tracking number.');
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = 'Tracking...';

            try {
                const result = await fetchTrackingData(trackingId);
                document.getElementById('resultTrackingId').textContent = trackingId.toUpperCase();
                document.getElementById('resultStatus').textContent = result.status;
                document.getElementById('resultLastUpdate').textContent = result.lastUpdate;
                document.getElementById('resultEstDelivery').textContent = result.estimatedDelivery;

                const historyList = document.getElementById('resultHistory');
                historyList.innerHTML = ''; // Clear previous history
                result.history.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    historyList.appendChild(li);
                });
                trackingResultsDiv.classList.remove('hidden');
            } catch (error) {
                console.error(error);
                trackingErrorDiv.classList.remove('hidden');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Track';
            }
        });
    }

    // --- Hero Carousel Logic ---
    function setupHeroCarousel() {
        const carouselSection = document.getElementById('hero-carousel-section');
        if (!carouselSection) return; // Don't run if the carousel isn't on the page

        const slides = carouselSection.querySelectorAll('.hero-slide');
        const prevBtn = document.getElementById('hero-prev');
        const nextBtn = document.getElementById('hero-next');
        const dotsContainer = document.getElementById('hero-dots');
        const slideCount = slides.length;
        let currentIndex = 0;
        let intervalId;
        let dots = []; // Initialize dots as an empty array for robust access

        // If there's only one slide or no slides, hide controls and stop.
        if (slideCount <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            // Ensure the single slide is visible if it exists
            if (slides.length > 0) slides[0].classList.add('opacity-100');
            return;
        }

        function showSlide(index) {
            // Guard against errors if slides array is empty
            if (slides.length === 0) return;

            // Remove animation from the outgoing slide's text elements
            slides[currentIndex].querySelectorAll('.fade-in-up').forEach(el => el.style.animation = 'none');

            // Update index, wrapping around for seamless looping
            currentIndex = (index + slideCount) % slideCount;

            // Update slides' visibility and z-index
            slides.forEach((slide, i) => {
                slide.classList.toggle('opacity-100', i === currentIndex);
                slide.classList.toggle('z-10', i === currentIndex); // Ensure active slide is on top for interactions
            });

            // Update dots' active state if they exist
            if (dots.length > 0) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('bg-white', i === currentIndex);
                    dot.classList.toggle('bg-white/50', i !== currentIndex);
                });
            }

            // Trigger animation for the new slide's text elements
            const newTextElements = slides[currentIndex].querySelectorAll('.fade-in-up');
            newTextElements.forEach(el => {
                el.style.animation = 'none'; // 1. Reset animation
                void el.offsetWidth;         // 2. Trigger a reflow, which flushes CSS changes
                el.style.animation = '';     // 3. Re-apply the animation from the stylesheet
            });
        }

        // --- Autoplay ---
        const startAutoplay = () => {
            stopAutoplay(); // Ensure no multiple intervals are running
            intervalId = setInterval(() => showSlide(currentIndex + 1), 7000);
        };
        const stopAutoplay = () => clearInterval(intervalId);
        const resetAutoplay = () => {
            stopAutoplay();
            startAutoplay();
        };

        // --- Initialize Controls & Dots ---
        if (nextBtn) {
            nextBtn.addEventListener('click', () => { showSlide(currentIndex + 1); resetAutoplay(); });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => { showSlide(currentIndex - 1); resetAutoplay(); });
        }
        if (dotsContainer) {
            for (let i = 0; i < slideCount; i++) {
                const dot = document.createElement('button');
                dot.classList.add('w-3', 'h-3', 'bg-white/50', 'rounded-full', 'transition-colors', 'duration-300', 'hover:bg-white');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.dataset.index = i;
                dotsContainer.appendChild(dot);
            }
            dots = dotsContainer.querySelectorAll('button');
            dots.forEach(dot => dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                if (index !== currentIndex) {
                    showSlide(index);
                    resetAutoplay();
                }
            }));
        }

        // --- Initialize Autoplay Listeners ---
        carouselSection.addEventListener('mouseenter', stopAutoplay);
        carouselSection.addEventListener('mouseleave', startAutoplay);

        // Initial setup
        showSlide(0);
        startAutoplay();
    }

    setupHeroCarousel();

    // --- Partners Carousel Logic ---
    function setupPartnersCarousel() {
        const section = document.getElementById('partners-carousel-section');
        if (!section) return;

        const track = document.getElementById('partners-carousel-track');
        const nextBtn = document.getElementById('partners-next');
        const prevBtn = document.getElementById('partners-prev');
        
        if (!track || !nextBtn || !prevBtn) {
            console.warn('A required element for the partners carousel is missing.');
            return;
        }

        const slides = Array.from(track.children);
        if (slides.length === 0) {
            section.style.display = 'none';
            return;
        }

        let currentIndex = 0;

        // Returns the number of slides visible at current viewport width
        const getVisibleSlidesCount = () => {
            const width = window.innerWidth;
            if (width >= 1024) return 6; // Tailwind 'lg' breakpoint
            if (width >= 768) return 4;  // Tailwind 'md' breakpoint
            return 2; // Default for smaller screens
        };

        const updateCarousel = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            const visibleSlides = getVisibleSlidesCount();
            const maxIndex = slides.length > visibleSlides ? slides.length - visibleSlides : 0;

            // Ensure currentIndex is within valid bounds
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            // Update button disabled state
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateCarousel();
        });

        // Update carousel on window resize
        window.addEventListener('resize', updateCarousel);

        // Initial setup
        track.style.transition = 'transform 0.5s ease-in-out';
        updateCarousel();
    }

    setupPartnersCarousel();
});
