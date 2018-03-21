'use strict';
module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('User', {
        username: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        tableName: 'users'
    });
    User.associate = function (models) {
        // associations can be defined here
    };
    return User;
};