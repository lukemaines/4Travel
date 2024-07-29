document.addEventListener('DOMContentLoaded', () => {
    const showTripDetailsButton = document.getElementById('showTripDetails');
    showTripDetailsButton.addEventListener('click', handleTripSelection);
    console.log('Event listener added to the Show Details button');
  });
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  async function handleTripSelection() {
    console.log('Show Details button clicked');
    const tripDropdown = document.getElementById('tripDropdown');
    const selectedOption = tripDropdown.options[tripDropdown.selectedIndex];
    const tripId = selectedOption.value;
    console.log('Selected trip ID:', tripId);
  
    if (tripId) {
      const tripDetails = document.getElementById('tripDetails');
      const tripOrigin = selectedOption.getAttribute('data-trip-origin');
      const tripDestination = selectedOption.getAttribute('data-trip-destination');
      const tripStartDate = selectedOption.getAttribute('data-trip-start-date');
      const tripEndDate = selectedOption.getAttribute('data-trip-end-date');
      const tripBudget = selectedOption.getAttribute('data-trip-budget');
  
      console.log('Trip details:', { tripOrigin, tripDestination, tripStartDate, tripEndDate, tripBudget });
  
      document.getElementById('tripDetailsOrigin').textContent = tripOrigin;
      document.getElementById('tripDetailsDestination').textContent = tripDestination;
      document.getElementById('tripDetailsDate').textContent = `${formatDate(tripStartDate)} - ${formatDate(tripEndDate)}`;
      document.getElementById('tripDetailsBudget').textContent = tripBudget;
  
      tripDetails.style.display = 'block';
      console.log('Trip details displayed');
  
      await getAttractions(tripDestination, tripId);
    } else {
      document.getElementById('tripDetails').style.display = 'none';
      console.log('No trip selected, hiding details');
    }
  }
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function getAttractions(destination, tripId) {
    console.log('Fetching attractions for:', destination);
    try {
      await delay(1000); // Introduce a 1-second delay before making the request
  
      const response = await fetch(`/api/trips/attractions?destination=${encodeURIComponent(destination)}`);
      if (!response.ok) {
        throw new Error(`Error fetching attractions: ${response.statusText} (${response.status})`);
      }
  
      const data = await response.json();
      console.log('Attractions data:', data);
      const poiList = document.getElementById('poiList');
      poiList.innerHTML = ''; // Clear any existing content
  
      data.forEach(attraction => {
        const li = document.createElement('li');
        li.textContent = attraction.name;
        poiList.appendChild(li);
      });
    } catch (error) {
      console.error(error);
      const poiList = document.getElementById('poiList');
      poiList.innerHTML = '<li>Error fetching attractions. Please try again later.</li>';
    }
  }
  