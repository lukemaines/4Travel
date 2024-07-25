const express = require('express');
const router = express.Router();
const tripRoutes = require('./tripRoutes');

router.use('/trips', tripRoutes);

module.exports = router;
