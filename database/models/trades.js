'use strict';
module.exports = (sequelize, DataTypes) => {
    let Trade = sequelize.define('Trade', {
        price: DataTypes.DECIMAL,
        quantity: DataTypes.DECIMAL,
        takeProfit: DataTypes.DECIMAL,
        stopLoss: DataTypes.DECIMAL,
        time: DataTypes.BIGINT,
        symbol: DataTypes.STRING,
        timeFormat: DataTypes.STRING,
        closed: DataTypes.BOOLEAN,
        success: DataTypes.BOOLEAN,
        mark: DataTypes.STRING,
        ratio: DataTypes.DECIMAL
    }, {
        tableName: 'trades',
    });
    Trade.associate = function (models) {
        // associations can be defined here
    };
    return Trade;
};