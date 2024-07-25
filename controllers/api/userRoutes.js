const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.get('/cities/:city_name', async (req, res) => {
  const { city_name } = req.params;

  try {
    const city = await City.findOne({ where: { name: city_name } });

    if (!city) {
      return res.status(404).send('City not found');
    }

    const meals = await Meal.findAll({ where: { city_id: city.id } });
    const transportation = await Transportation.findAll({ where: { city_id: city.id } });

    res.json({
      name: city.name,
      country: city.country,
      meals,
      transportation
    });
  } catch (error) {
    console.error('Error retrieving data from database:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
