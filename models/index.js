const Sequelize = require('sequelize');
const sequelize = require('../config/connection'); // Path to your connection configuration

// Import models
const City = require('./City');
const Meal = require('./Meal');
const Transportation = require('./Transportation');

// Initialize models with model attributes and sequelize instance
City.init({
  // Define City attributes here
}, {
  sequelize,
  modelName: 'City'
});

Meal.init({
  // Define Meal attributes here
}, {
  sequelize,
  modelName: 'Meal'
});

Transportation.init({
  // Define Transportation attributes here
}, {
  sequelize,
  modelName: 'Transportation'
});

// Define associations
City.hasMany(Meal, { foreignKey: 'city_id', onDelete: 'CASCADE' });
Meal.belongsTo(City, { foreignKey: 'city_id' });

// Export models and sequelize instance
const db = {
  City,
  Meal,
  Transportation,
  sequelize,
  Sequelize
};

module.exports = db;