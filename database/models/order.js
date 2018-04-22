'use strict';
module.exports = (sequelize, DataTypes) => {
    let Order = sequelize.define('Order', {
        trade_id: DataTypes.INT,
        symbol_id: DataTypes.INT,
        side: DataTypes.STRING,
        type: DataTypes.STRING,
        status: DataTypes.STRING,
        origQty: DataTypes.DECIMAL,
        executedQty: DataTypes.DECIMAL,
        price: DataTypes.DECIMAL,
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
            as: 'symbol'
        });
    };



    return Order;
};