const express = require('express');
const { Trip } = require('../../models');
const fetch = require('node-fetch');
require('dotenv').config();

const router = express.Router();
const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
const truewayApiKey = process.env.TRUEWAY_API_KEY;
const rapidapiKey = process.env.RAPIDAPI_KEY;
const rapidapiHost = process.env.RAPIDAPI_HOST;

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
    method: "GET",
    headers: {
      "x-rapidapi-host": "trueway-places.p.rapidapi.com",
      "x-rapidapi-key": truewayApiKey
    }
  });
  const data = await response.json();
  return data.results.slice(0, 5); // Return top 5 attractions
}

async function getCostOfLiving(cityName, countryName) {
  const url = `https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${encodeURIComponent(cityName)}&country_name=${encodeURIComponent(countryName)}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': rapidapiKey,
      'x-rapidapi-host': rapidapiHost
    }
  };

  const response = await fetch(url, options);
  const data = await response.json();

  const meals = data.prices
    .filter(item => item.category_name === 'Restaurants')
    .map(item => ({
      item_name: item.item_name,
      average_price: item.avg,
      currency: item.currency_code
    }));

  const transportation = data.prices
    .filter(item => item.category_name === 'Transportation')
    .map(item => ({
      item_name: item.item_name,
      average_price: item.avg,
      currency: item.currency_code
    }));

  return { meals, transportation };
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

router.post('/cost-of-living', async (req, res) => {
  const { destination } = req.body;
  console.log('Received destination:', destination); // Log the received destination

  if (!destination) {
    console.error('Destination is missing');
    return res.status(400).json({ error: 'Destination is required' });
  }

  const parts = destination.split(',');
  console.log('Split parts:', parts); // Log the split parts

  if (parts.length < 2) {
    console.error('Invalid destination format:', destination);
    return res.status(400).json({ error: 'Destination must be in the format "City, Country"' });
  }

  const cityName = parts[0].trim();
  const countryName = parts.slice(1).join(',').trim(); // Handle cases like "New York, USA" or "Los Angeles, USA"

  console.log('City:', cityName, 'Country:', countryName); // Log the extracted city and country

  if (!cityName || !countryName) {
    console.error('Invalid destination parts:', { cityName, countryName });
    return res.status(400).json({ error: 'Destination must be in the format "City, Country"' });
  }

  try {
    console.log(`Fetching cost of living for city: ${cityName}, country: ${countryName}`);
    const costOfLiving = await getCostOfLiving(cityName, countryName);
    res.json(costOfLiving);
  } catch (err) {
    console.error('Error fetching cost of living data:', err);
    res.status(500).json({ error: 'Failed to load cost of living data' });
  }
});

module.exports = router;
