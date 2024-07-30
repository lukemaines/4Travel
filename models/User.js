const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/connection');
// referencing the trip table
 
// function for checking the password with bcrypt for hash vs. typed password
class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password); 
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
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    },
// hooks for executing the hash on the password when it's either created or updated
    {   hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);  
                return newUserData;        
            },
            beforeUpdate: async (updatedUserData) => {
                if (updatedUserData._changed.has('password')) {
                    updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                }
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