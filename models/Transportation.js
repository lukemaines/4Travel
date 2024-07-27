const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection'); // Adjust the path as needed

class Transportation extends Model {}

Transportation.init({
  item_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  average_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Cities', // Ensure this matches the actual table name
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Transportation'
});

module.exports = Transportation;