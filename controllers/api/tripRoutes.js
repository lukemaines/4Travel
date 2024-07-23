const router = require('express').Router();
const { Trip } = require('../../models');

// POST create trip
router.post('/create', ensureAuthenticated, async (req, res) => {
    const { trip_name, trip_origin, destination, start_date, end_date, budget } = req.body;
    
    try {
      await Trip.create({
        user_id: req.user.id,
        trip_name,
        trip_origin,
        destination,
        start_date,
        end_date,
        budget,
      });
       res.redirect('/trips');
    } catch (err) {
      console.error(err);
      res.render('plan_trip', {
        user: req.user,
        error: 'Failed to create trip. Please try again.',
      });
    }
  });

// GET user's trips
router.get('/', async (req, res) => {
    try {
      const trips = await Trip.findAll({ where: { user_id: req.user.id } });
      res.render('trips', {
        user: req.user,
        trips,
      });
    } catch (err) {
      console.error(err);
      res.render('trips', {
        user: req.user,
        error: 'Failed to load trips. Please try again.',
      });
    }
});

module.exports = router;