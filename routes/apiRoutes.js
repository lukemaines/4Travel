const express = require('express');
const router = express.Router();
const { City } = require('../models');

router.post('/cities', async (req, res) => {
  const { city_name, country_name } = req.body;
  const url = `https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${encodeURIComponent(city_name)}&country_name=${encodeURIComponent(country_name)}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url, options);
    const result = await response.json();

    const meals = result.prices
      .filter(item => item.category_name === 'Restaurants')
      .map(item => ({
        item_name: item.item_name,
        average_price: item.avg,
        currency: item.currency_code
      }));

    const transportation = result.prices
      .filter(item => item.category_name === 'Transportation')
      .map(item => ({
        item_name: item.item_name,
        average_price: item.avg,
        currency: item.currency_code
      }));

    res.json({
      name: city_name,
      country: country_name,
      meals,
      transportation
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;