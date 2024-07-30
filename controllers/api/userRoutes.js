const express = require('express');
const { User } = require('../../models');

const router = express.Router();

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

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/api/users/profile');
  } else {
    res.render('login');
  }
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    req.session.userId = user.id;
    req.session.loggedIn = true;
    res.redirect('/api/users/profile');
  } catch (err) {
    console.error(err);
    res.render('register', {
      error: 'Failed to create user. Please try again.',
    });
  }
});

router.get('/profile', (req, res) => {
  if (!req.session.loggedIn) {
      res.redirect('/api/users/login');
  } else {
      res.render('user_profile');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/api/users/profile'); // Redirect to profile if there's an issue
    }
    res.redirect('/api/users/login'); // Redirect to login page after logout
  });
});



module.exports = router;
