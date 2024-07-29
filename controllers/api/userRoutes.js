const express = require('express');
const { User } = require('../../models');

const router = express.Router();

router.get('/user', (req, res) => {
  res.render('user_profile');
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await User.create({
      username,
      email,
      password,
    });
    res.redirect('/api/users');
  } catch (err) {
    console.error(err);
    res.render('user_profile', {
      error: 'Failed to create user. Please try again.',
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('users', {
      users: users.map(user => user.toJSON()),
    });
  } catch (err) {
    console.error(err);
    res.render('users', {
      error: 'Failed to load users. Please try again.',
    });
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

module.exports = router;

