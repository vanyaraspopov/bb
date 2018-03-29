'use strict';
module.exports = (sequelize, DataTypes) => {
    let Symbol = sequelize.define('Symbol', {
        quot: DataTypes.STRING,
        base: DataTypes.STRING
    }, {
        tableName: 'symbols',
    });
    Symbol.associate = function (models) {
        // associations can be defined here
    };

    Symbol.symbol = function (separator = '') {
        return this.quot + separator + this.base;
    };

    return Symbol;
};