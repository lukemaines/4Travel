const express = require('express');
const router = express.Router();
const { City } = require('../models');

router.get('/', async (req, res) => {
  res.render('home');
});

router.get('/results', async (req, res) => {
  const cities = await City.findAll({
    include: ['Meals', 'Transportation']
  });
  res.render('results', { cities });
});

module.exports = router;