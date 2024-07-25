const User = require('./User');

// eager loading table relationships between user and trips tables
User.hasMany(Trip, {
    foreignKey: 'userId',
    // the user's trips will also be deleted if we delete the user
    onDelete: 'CASCADE',
});

Trip.belongsTo(User, {
    foreignKey: 'userId',
});

module.exports = { User };
