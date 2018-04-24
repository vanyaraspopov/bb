'use strict';
module.exports = (sequelize, DataTypes) => {
    let Order = sequelize.define('Order', {
        trade_id: DataTypes.INTEGER,
        symbol_id: DataTypes.INTEGER,
        exchange_order_id: DataTypes.INTEGER,
        symbol: DataTypes.STRING,
        side: DataTypes.STRING,
        type: DataTypes.STRING,
        status: DataTypes.STRING,
        origQty: DataTypes.DECIMAL,
        executedQty: DataTypes.DECIMAL,
        price: DataTypes.DECIMAL,
        stopPrice: DataTypes.DECIMAL,
        time: DataTypes.BIGINT
    }, {
        tableName: 'orders',
    });
    Order.associate = function (models) {
        models.Order.belongsTo(models.Trade, {
            foreignKey: 'trade_id',
            as: 'trade'
        });
        models.Order.belongsTo(models.Symb, {
            foreignKey: 'symbol_id',
            as: 'symb'
        });
    };

    return Order;
};