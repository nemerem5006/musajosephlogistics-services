document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
            // Optional: Change button icon
            const icon = menuButton.querySelector('svg');
            if (mobileMenu.classList.contains('hidden')) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            }
        });
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Contact Form Submission (Placeholder)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const messageDiv = document.getElementById('form-submission-message');
            messageDiv.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');

            // Simulate form submission
            messageDiv.textContent = 'Sending your message...';
            messageDiv.classList.add('bg-blue-100', 'text-blue-700');
            messageDiv.classList.remove('hidden');


            setTimeout(() => {
                // Simulate success
                messageDiv.textContent = 'Thank you! Your message has been sent successfully.';
                messageDiv.classList.remove('bg-blue-100', 'text-blue-700');
                messageDiv.classList.add('bg-green-100', 'text-green-700');
                contactForm.reset();

                setTimeout(() => {
                    messageDiv.classList.add('hidden');
                }, 5000); // Hide after 5 seconds

            }, 2000); // Simulate network delay
        });
    }

    // Tracking Form Submission (Placeholder)
    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const trackingNumberInput = document.getElementById('trackingNumber');
            const trackingResultsDiv = document.getElementById('trackingResults');
            const trackingErrorDiv = document.getElementById('trackingError');
            const trackingId = trackingNumberInput.value.trim().toUpperCase();

            // Hide previous results/errors
            trackingResultsDiv.classList.add('hidden');
            trackingErrorDiv.classList.add('hidden');

            if (!trackingId) {
                alert('Please enter a tracking number.');
                return;
            }

            // Simulate API call
            console.log(`Simulating tracking for: ${trackingId}`);
            // Show a loading state (optional)

            setTimeout(() => {
                // Mock data - in a real app, this would come from a backend API
                const mockData = {
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

                const result = mockData[trackingId];

                if (result) {
                    document.getElementById('resultTrackingId').textContent = trackingId;
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
                } else {
                    trackingErrorDiv.classList.remove('hidden');
                }
            }, 1500); // Simulate API delay
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

        if (slideCount <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            if (slides.length > 0) slides[0].classList.add('opacity-100');
            return;
        }

        // Create pagination dots
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('w-3', 'h-3', 'bg-white/50', 'rounded-full', 'transition-colors', 'duration-300', 'hover:bg-white');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('button');

        function showSlide(index) {
            // Remove animation from the outgoing slide's text elements
            slides[currentIndex].querySelectorAll('.fade-in-up').forEach(el => el.style.animation = 'none');

            // Update index, wrapping around if necessary
            currentIndex = (index + slideCount) % slideCount;

            // Update slides' visibility and z-index
            slides.forEach((slide, i) => {
                slide.classList.toggle('opacity-100', i === currentIndex);
                slide.classList.toggle('z-10', i === currentIndex); // Ensure active slide is on top
            });

            // Update dots' active state
            dots.forEach((dot, i) => {
                dot.classList.toggle('bg-white', i === currentIndex);
                dot.classList.toggle('bg-white/50', i !== currentIndex);
            });

            // Trigger animation for the new slide's text elements
            const newTextElements = slides[currentIndex].querySelectorAll('.fade-in-up');
            newTextElements.forEach(el => {
                el.style.animation = 'none'; // Reset animation
                void el.offsetWidth; // Trigger reflow to restart animation
                el.style.animation = ''; // Re-apply animation from CSS
            });
        }

        const startAutoplay = () => intervalId = setInterval(() => showSlide(currentIndex + 1), 7000);
        const stopAutoplay = () => clearInterval(intervalId);
        const resetAutoplay = () => {
            stopAutoplay();
            startAutoplay();
        };

        nextBtn.addEventListener('click', () => { showSlide(currentIndex + 1); resetAutoplay(); });
        prevBtn.addEventListener('click', () => { showSlide(currentIndex - 1); resetAutoplay(); });
        dots.forEach(dot => dot.addEventListener('click', () => { showSlide(parseInt(dot.dataset.index)); resetAutoplay(); }));
        carouselSection.addEventListener('mouseenter', stopAutoplay);
        carouselSection.addEventListener('mouseleave', startAutoplay);

        // Initial setup
        showSlide(0);
        startAutoplay();
    }

    setupHeroCarousel();
});


