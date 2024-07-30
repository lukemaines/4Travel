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
      await getCostOfLiving(tripDestination);
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
  
  async function getCostOfLiving(destination) {
    console.log('Fetching cost of living for:', destination);
    try {
      console.log('Sending request to /api/trips/cost-of-living with destination:', destination);
      const response = await fetch(`/api/trips/cost-of-living`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination }), // Ensure destination is passed correctly
      });
  
      console.log('Request sent. Awaiting response...');
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await response.json();
      console.log('Cost of living data:', result);
  
      const resultsDiv = document.getElementById("results");
      if (resultsDiv) {
        resultsDiv.innerHTML = `<h3>Meals</h3>
                                <ul>${result.meals.map(item => `<li>${item.item_name}: ${item.average_price} ${item.currency}</li>`).join("")}</ul>
                                <h3>Transportation</h3>
                                <ul>${result.transportation.map(item => `<li>${item.item_name}: ${item.average_price} ${item.currency}</li>`).join("")}</ul>`;
      } else {
        console.error('Results div not found');
      }
    } catch (error) {
      console.error('Error in getCostOfLiving:', error);
      const resultsDiv = document.getElementById("results");
      if (resultsDiv) {
        resultsDiv.innerHTML = '<p>Error fetching cost of living data. Please try again later.</p>';
      } else {
        console.error('Results div not found');
      }
    }
  }
  