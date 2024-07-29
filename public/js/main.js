document.addEventListener('DOMContentLoaded', () => {
    const tripElements = document.querySelectorAll('[data-trip-id]');
    tripElements.forEach(element => {
        const tripId = element.getAttribute('data-trip-id');
        const destination = element.getAttribute('data-trip-destination');
        getAttractions(destination, tripId);
    });
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAttractions(destination, tripId) {
    try {
        await delay(1000); // Introduce a 1-second delay before making the request

        const response = await fetch(`/api/trips/attractions?destination=${encodeURIComponent(destination)}`);
        if (!response.ok) {
            throw new Error(`Error fetching attractions: ${response.statusText} (${response.status})`);
        }

        const data = await response.json();
        const poiList = document.querySelector(`#poi-${tripId} ul`);
        poiList.innerHTML = ''; // Clear any existing content

        data.forEach(attraction => {
            const li = document.createElement('li');
            li.textContent = attraction.name;
            poiList.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        const poiList = document.querySelector(`#poi-${tripId} ul`);
        poiList.innerHTML = '<li>Error fetching attractions. Please try again later.</li>';
    }
}


