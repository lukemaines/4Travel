const sequelize = require('../config/connection');
const { Trip } = require('../models');

const tripData = require('./tripData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await Trip.bulkCreate(tripData);

  process.exit(0);
};

seedDatabase();
