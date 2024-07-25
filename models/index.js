const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const Trip = require('./Trip');

const db = {
  Trip,
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

