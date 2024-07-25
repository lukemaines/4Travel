const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');
// referencing the trip table
const Trip = require('./Trip'); 
// function for checking the password with bcrypt for hash vs. typed password
class User extends Model {
    checkPassword(userPassword) {
        return bcrypt.compareSync(userPassword, this.password); 
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, 
            autoIncrement: true,
            
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                notNull: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true,
                notNull: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notNull: true,
            },
        },

    },
// hooks for executing the hash on the password when it's either created or updated
    {   hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10)   
                return newUserData         
            },
            beforeUpdate: async (updatedUserData) => {
                if (updatedUserData._changed.has('password')) {
                    updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);}
                    return updatedUserData;
            }
    },
        sequelize,
        timestamps: false,
        freezeTableName: true, 
        underscored: true,
        modelName: 'user',
    }
);

module.exports = User;