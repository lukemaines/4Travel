module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define('City', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false
      },
      meals: {
        type: DataTypes.JSON,
        allowNull: false
      },
      transportation: {
        type: DataTypes.JSON,
        allowNull: false
      }
    });
    return City;
  };

// const { Model, DataTypes } = require("sequelize");
// const sequelize = require("../config/connection");

// class City extends Model {}

// City.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     country: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: "City",
//     timestamps: false,
//   }
// );

// module.exports = City;
