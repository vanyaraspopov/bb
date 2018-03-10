'use strict';
module.exports = (sequelize, DataTypes) => {
    var Currency = sequelize.define('Currency', {
        quot: DataTypes.STRING,
        base: DataTypes.STRING,
        sum: DataTypes.DECIMAL,
        params: DataTypes.STRING,
        active: DataTypes.BOOLEAN
    }, {
        tableName: 'currencies'
    });
    Currency.associate = function (models) {
        // associations can be defined here
    };
    return Currency;
};