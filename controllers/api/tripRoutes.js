const express = require('express');
const { Trip } = require('../../models');
const fetch = require('node-fetch');
require('dotenv').config();

const router = express.Router();
const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
const truewayApiKey = process.env.TRUEWAY_API_KEY;

async function getCoordinates(location) {
  const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${geoapifyApiKey}`);
  const data = await response.json();
  if (data.features && data.features.length > 0) {
    return {
      latitude: data.features[0].geometry.coordinates[1],
      longitude: data.features[0].geometry.coordinates[0]
    };
  } else {
    throw new Error('Location not found');
  }
}

async function getNearbyAttractions(latitude, longitude) {
  const response = await fetch(`https://trueway-places.p.rapidapi.com/FindPlacesNearby?location=${latitude}%2C${longitude}&type=tourist_attraction&radius=5000&language=en`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "trueway-places.p.rapidapi.com",
      "x-rapidapi-key": truewayApiKey
    }
  });
  const data = await response.json();
  return data.results.slice(0, 5); // Return top 5 attractions
}

router.get('/plan', (req, res) => {
  res.render('plan_trip');
});

router.post('/create', async (req, res) => {
  const { trip_name, trip_origin, destination, start_date, end_date, budget } = req.body;

  try {
    await Trip.create({
      trip_name,
      trip_origin,
      destination,
      start_date,
      end_date,
      budget,
    });
    res.redirect('/api/trips'); // Updated redirect URL
  } catch (err) {
    console.error(err);
    res.render('plan_trip', {
      error: 'Failed to create trip. Please try again.',
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const trips = await Trip.findAll();
    res.render('trips', {
      trips: trips.map(trip => trip.toJSON()), // Convert instances to plain objects
    });
  } catch (err) {
    console.error(err);
    res.render('trips', {
      error: 'Failed to load trips. Please try again.',
    });
  }
});

router.get('/attractions', async (req, res) => {
  const { destination } = req.query;
  try {
    const { latitude, longitude } = await getCoordinates(destination);
    const attractions = await getNearbyAttractions(latitude, longitude);
    res.json(attractions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load attractions' });
  }
});

module.exports = router;
