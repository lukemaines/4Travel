const express = require('express');
const router = express.Router();
const tripRoutes = require('./tripRoutes');
const userRoutes = require('./userRoutes');

router.use('/trips', tripRoutes);
router.use('/users', userRoutes);

module.exports = router;
