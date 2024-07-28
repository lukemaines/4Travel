document.addEventListener('DOMContentLoaded', () => {
    const tripElements = document.querySelectorAll('[data-trip-id]');
    tripElements.forEach(element => {
        const tripId = element.getAttribute('data-trip-id');
        const destination = element.getAttribute('data-trip-destination');
        getAttractions(destination, tripId);
    });
});

function getAttractions(destination, tripId) {
    fetch(`/api/trips/attractions?destination=${encodeURIComponent(destination)}`)
        .then(response => response.json())
        .then(data => {
            const poiList = document.querySelector(`#poi-${tripId} ul`);
            data.forEach(attraction => {
                const li = document.createElement('li');
                li.textContent = attraction.name;
                poiList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching attractions:', error));
}
