const express = require('express');
const { User, Trip } = require('../../models');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await User.create({ username, email, password });
    req.session.userId = newUser.id;
    req.session.loggedIn = true;
    res.redirect('/api/users/profile');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Failed to create user. Please try again.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.checkPassword(password)) {
      res.render('login', { error: 'Incorrect email or password. Please try again.' });
      return;
    }
    req.session.userId = user.id;
    req.session.loggedIn = true;
    res.redirect('/api/users/profile');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Failed to login. Please try again.' });
  }
});

// Render login page
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// Render register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Render user profile page
router.get('/profile', async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/api/users/login');
    return;
  }

  try {
    const user = await User.findByPk(req.session.userId, {
      include: [{ model: Trip, as: 'trips' }],
    });
    res.render('user_profile', { user: user.get({ plain: true }) });
  } catch (err) {
    console.error(err);
    res.redirect('/api/users/login');
  }
});

module.exports = router;
