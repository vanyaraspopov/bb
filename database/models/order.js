'use strict';
module.exports = (sequelize, DataTypes) => {
    let order = sequelize.define('order', {
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
    }, {});
    order.associate = function (models) {
        // associations can be defined here
    };
    return order;
};