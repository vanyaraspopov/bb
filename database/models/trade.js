'use strict';
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    let Trade = sequelize.define('Trade', {
        module_id: DataTypes.INTEGER,
        price: DataTypes.DECIMAL,
        take_profit_order_id: DataTypes.INTEGER,
        stop_loss_order_id: DataTypes.INTEGER,
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
        models.Trade.hasMany(models.Order, {
            foreignKey: 'trade_id',
            as: 'orders',
            hooks: true
        });
        models.Trade.belongsTo(models.Order, {
            foreignKey: 'take_profit_order_id',
            as: 'TakeProfitOrder',
            hooks: true
        });
        models.Trade.belongsTo(models.Order, {
            foreignKey: 'stop_loss_order_id',
            as: 'StopLossOrder',
            hooks: true
        });
        models.Trade.belongsTo(models.Module, {
            foreignKey: 'module_id',
            as: 'module'
        });
    };

    /**
     * Check if trade was created more than <minutes> ago
     * @param minutes
     * @returns {boolean}
     */
    Trade.prototype.checkExpired = function (minutes) {
        let time = moment().subtract(minutes, 'minutes').unix() * 1000;
        return this.time <= time;
    };

    return Trade;
};