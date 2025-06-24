document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconHamburger = document.getElementById('icon-hamburger');
    const iconClose = document.getElementById('icon-close');

    if (mobileMenuButton && mobileMenu && iconHamburger && iconClose) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            iconHamburger.classList.toggle('hidden');
            iconClose.classList.toggle('hidden');
        });
    }

    // --- Current Year for Footer ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Hero Carousel ---
    const heroCarousel = document.getElementById('hero-carousel');
    const heroPrevBtn = document.getElementById('hero-prev');
    const heroNextBtn = document.getElementById('hero-next');
    const heroDotsContainer = document.getElementById('hero-dots');

    if (heroCarousel && heroPrevBtn && heroNextBtn && heroDotsContainer) {
        const heroSlides = Array.from(heroCarousel.children);
        let heroCurrentIndex = 0;
        let heroAutoplayInterval;
        const heroAutoplayDelay = 5000; // 5 seconds

        const createHeroDots = () => {
            heroDotsContainer.innerHTML = ''; // Clear existing dots
            heroSlides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-white/50', 'hover:bg-white', 'transition-colors', 'duration-300');
                if (index === heroCurrentIndex) {
                    dot.classList.add('bg-white');
                }
                dot.addEventListener('click', () => {
                    heroCurrentIndex = index;
                    updateHeroCarousel();
                    startHeroAutoplay();
                });
                heroDotsContainer.appendChild(dot);
            });
        };

        const updateHeroCarousel = () => {
            heroSlides.forEach((slide, index) => {
                if (index === heroCurrentIndex) {
                    slide.classList.remove('opacity-0');
                    slide.classList.add('opacity-100');
                } else {
                    slide.classList.remove('opacity-100');
                    slide.classList.add('opacity-0');
                }
            });
            createHeroDots(); // Update dots to reflect current slide
        };

        const nextHeroSlide = () => {
            heroCurrentIndex = (heroCurrentIndex + 1) % heroSlides.length;
            updateHeroCarousel();
        };

        const prevHeroSlide = () => {
            heroCurrentIndex = (heroCurrentIndex - 1 + heroSlides.length) % heroSlides.length;
            updateHeroCarousel();
        };

        const startHeroAutoplay = () => {
            stopHeroAutoplay(); // Clear any existing interval
            heroAutoplayInterval = setInterval(nextHeroSlide, heroAutoplayDelay);
        };

        const stopHeroAutoplay = () => {
            clearInterval(heroAutoplayInterval);
        };

        // Event Listeners for Hero Carousel
        heroNextBtn.addEventListener('click', () => {
            nextHeroSlide();
            startHeroAutoplay(); // Restart autoplay on manual navigation
        });
        heroPrevBtn.addEventListener('click', () => {
            prevHeroSlide();
            startHeroAutoplay(); // Restart autoplay on manual navigation
        });

        // Initial setup for Hero Carousel
        updateHeroCarousel();
        startHeroAutoplay();
    }

    // --- Partners Carousel ---
    const partnersCarouselTrack = document.getElementById('partners-carousel-track');
    const partnersPrevBtn = document.getElementById('partners-prev');
    const partnersNextBtn = document.getElementById('partners-next');
    const partnersCarouselWrapper = document.getElementById('partners-carousel-wrapper');

    if (partnersCarouselTrack && partnersPrevBtn && partnersNextBtn && partnersCarouselWrapper) {
        const partnersSlides = Array.from(partnersCarouselTrack.children);
        let partnersCurrentIndex = 0;
        let partnersAutoplayInterval;
        const partnersAutoplayDelay = 3000; // 3 seconds

        const getPartnersVisibleSlidesCount = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                return 6;
            } else if (window.innerWidth >= 768) { // md breakpoint
                return 4;
            } else { // default for sm and below
                return 2;
            }
        };

        const updatePartnersCarousel = () => {
            if (partnersSlides.length === 0) return; // Prevent errors if no slides
            const slideWidth = partnersSlides[0].offsetWidth;
            const totalSlides = partnersSlides.length;
            const visibleSlides = getPartnersVisibleSlidesCount();

            // Calculate max index to prevent scrolling past the end
            const maxIndex = Math.max(0, totalSlides - visibleSlides);
            partnersCurrentIndex = Math.min(partnersCurrentIndex, maxIndex);
            partnersCurrentIndex = Math.max(0, partnersCurrentIndex);

            partnersCarouselTrack.style.transform = `translateX(-${partnersCurrentIndex * slideWidth}px)`;

            partnersPrevBtn.disabled = partnersCurrentIndex === 0;
            partnersNextBtn.disabled = partnersCurrentIndex >= maxIndex;
        };

        const nextPartnersSlide = () => {
            const totalSlides = partnersSlides.length;
            const visibleSlides = getPartnersVisibleSlidesCount();
            const maxIndex = Math.max(0, totalSlides - visibleSlides);

            if (partnersCurrentIndex < maxIndex) {
                partnersCurrentIndex++;
            } else {
                partnersCurrentIndex = 0; // Loop back to start
            }
            updatePartnersCarousel();
        };

        const prevPartnersSlide = () => {
            const totalSlides = partnersSlides.length;
            const visibleSlides = getPartnersVisibleSlidesCount();
            const maxIndex = Math.max(0, totalSlides - visibleSlides);

            if (partnersCurrentIndex > 0) {
                partnersCurrentIndex--;
            } else {
                partnersCurrentIndex = maxIndex; // Loop to end
            }
            updatePartnersCarousel();
        };

        const startPartnersAutoplay = () => {
            stopPartnersAutoplay(); // Clear any existing interval
            partnersAutoplayInterval = setInterval(nextPartnersSlide, partnersAutoplayDelay);
        };

        const stopPartnersAutoplay = () => {
            clearInterval(partnersAutoplayInterval);
        };

        // Event Listeners for Partners Carousel
        partnersNextBtn.addEventListener('click', () => {
            nextPartnersSlide();
            startPartnersAutoplay(); // Restart autoplay on manual navigation
        });
        partnersPrevBtn.addEventListener('click', () => {
            prevPartnersSlide();
            startPartnersAutoplay(); // Restart autoplay on manual navigation
        });

        partnersCarouselWrapper.addEventListener('mouseover', stopPartnersAutoplay);
        partnersCarouselWrapper.addEventListener('mouseleave', startPartnersAutoplay);

        // Handle window resize for Partners Carousel
        window.addEventListener('resize', () => {
            partnersCurrentIndex = 0; // Reset position on resize
            updatePartnersCarousel();
            startPartnersAutoplay(); // Restart autoplay
        });

        // Initial setup for Partners Carousel
        updatePartnersCarousel();
        startPartnersAutoplay();
    }
});