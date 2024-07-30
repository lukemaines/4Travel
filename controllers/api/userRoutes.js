const express = require('express');
const { User } = require('../../models');

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await User.create({ username, email, password });
    res.redirect('/api/users/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Failed to create user. Please try again.' });
  }
});

// Login Route
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

// Route to Render Login Page
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/api/users/profile');
    return;
  }
  res.render('login');
});

// Route to Render Registration Page
router.get('/register', (req, res) => {
  res.render('register');
});

// Profile Route
router.get('/profile', async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/api/users/login');
    return;
  }
  try {
    const user = await User.findByPk(req.session.userId);
    res.render('user_profile', { user: user.toJSON() });
  } catch (err) {
    console.error(err);
    res.redirect('/api/users/login');
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/api/users/login');
  });
});

module.exports = router;
