'use strict';
module.exports = (sequelize, DataTypes) => {
    var order = sequelize.define('order', {
        price: DataTypes.DECIMAL,
        quantity: DataTypes.DECIMAL,
        takeProfit: DataTypes.DECIMAL,
        stopLoss: DataTypes.DECIMAL,
        time: DataTypes.BIGINT,
        symbol: DataTypes.STRING,
        timeFormat: DataTypes.STRING
    }, {});
    order.associate = function (models) {
        // associations can be defined here
    };
    return order;
};