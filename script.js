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

});