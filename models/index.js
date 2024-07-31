const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const User = require('./User');
const Trip = require('./Trip');

const db = {
  User,
  Trip,
};

User.hasMany(Trip, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Trip.belongsTo(User, {
  foreignKey: 'user_id',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
