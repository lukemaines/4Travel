const express = require('express');
const { Trip } = require('../../models');

const router = express.Router();

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
      trips: trips.map(trip => trip.toJSON()),
    });
  } catch (err) {
    console.error(err);
    res.render('trips', {
      error: 'Failed to load trips. Please try again.',
    });
  }
});

module.exports = router;
