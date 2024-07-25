const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

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

    {   hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10)   
                return newUserData         
            },
            beforeUpdate: async (updatedUser)
    },
        sequelize,
        timestamps: false,
        freezeTableName: true, 
        underscored: true,
        modelName: 'user',
    }
)

module.exports = User;