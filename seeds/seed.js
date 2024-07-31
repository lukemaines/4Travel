const sequelize = require('../config/connection');
const { User, Trip } = require('../models');

const userData = require('./userData.json');
const tripData = require('./tripData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Trip.bulkCreate(tripData, {
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
