document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'http://localhost:3000/api';

  const trackingForm = document.getElementById('trackingForm');
  const trackingNumberInput = document.getElementById('trackingNumber');
  const trackingResultsDiv = document.getElementById('trackingResults');
  const trackingErrorDiv = document.getElementById('trackingError');
  const errorMessageSpan = document.getElementById('errorMessage'); // For displaying specific error messages
  const resultTrackingId = document.getElementById('resultTrackingId');
  const resultStatus = document.getElementById('resultStatus');
  const resultLastUpdate = document.getElementById('resultLastUpdate');
  const resultEstDelivery = document.getElementById('resultEstDelivery');
  const resultHistory = document.getElementById('resultHistory');
  const loader = document.getElementById('loader'); // Add a <div id="loader" class="hidden">...</div> to your HTML

  if (trackingForm && trackingNumberInput && trackingResultsDiv && trackingErrorDiv && errorMessageSpan &&
      resultTrackingId && resultStatus && resultLastUpdate && resultEstDelivery && resultHistory && loader) {

    trackingForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const trackingNumber = trackingNumberInput.value.trim().toUpperCase();

      // Reset UI state and show loader
      trackingResultsDiv.classList.add('hidden');
      trackingErrorDiv.classList.add('hidden');
      loader.classList.remove('hidden');

      try {
        const response = await fetch(`${API_BASE_URL}/track/${trackingNumber}`);

        if (response.ok) {
          const data = await response.json();
          resultTrackingId.textContent = data.id;
          resultStatus.textContent = data.status;
          // Format date for better readability
          resultLastUpdate.textContent = new Date(data.lastUpdate).toLocaleString();
          resultEstDelivery.textContent = data.estimatedDelivery;

          resultHistory.innerHTML = '';
          data.history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            resultHistory.appendChild(li);
          });

          trackingResultsDiv.classList.remove('hidden');
        } else if (response.status === 404) {
          errorMessageSpan.textContent = `Tracking number "${trackingNumber}" not found.`;
          trackingErrorDiv.classList.remove('hidden');
        } else {
          // Try to get a more specific error message from the server response
          const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
          errorMessageSpan.textContent = `Error: ${errorData.message || 'Could not retrieve tracking data.'}`;
          trackingErrorDiv.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        errorMessageSpan.textContent = 'Network error. Please try again.';
        trackingErrorDiv.classList.remove('hidden');
      } finally {
        // Always hide the loader when the operation is complete
        loader.classList.add('hidden');
      }
    });
  }
});