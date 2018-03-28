'use strict';
module.exports = (sequelize, DataTypes) => {
    let Currency = sequelize.define('Currency', {
        quot: DataTypes.STRING,
        base: DataTypes.STRING,
        sum: DataTypes.DECIMAL,
        params: DataTypes.STRING,
        active: DataTypes.BOOLEAN
    }, {
        tableName: 'currencies'
    });

    let paramsToString = function (currency) {
        if (typeof(currency.params) === 'object') {
            currency.params = JSON.stringify(currency.params);
        }
    };
    Currency.hook('beforeValidate', paramsToString);

    Currency.associate = function (models) {
        // associations can be defined here
    };
    return Currency;
};