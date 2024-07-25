const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const sequelize = new Sequelize(process.env.DATABASE_URL, config);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.City = require('./City')(sequelize, Sequelize);

module.exports = db;
// models/index.js
// const { Sequelize } = require('sequelize');
// const sequelize = require('../config/connection');

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.City = require('./City')(sequelize);
// db.Meal = require('./Meal')(sequelize);
// db.Transportation = require('./Transportation')(sequelize);

// db.City.hasMany(db.Meal, { foreignKey: 'city_id' });
// db.City.hasMany(db.Transportation, { foreignKey: 'city_id' });
// db.Meal.belongsTo(db.City, { foreignKey: 'city_id' });
// db.Transportation.belongsTo(db.City, { foreignKey: 'city_id' });

// module.exports = db;