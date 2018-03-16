'use strict';
module.exports = (sequelize, DataTypes) => {
    var AggTrade = sequelize.define('AggTrade', {
        symbol: DataTypes.STRING,
        timeStart: DataTypes.BIGINT,
        timeEnd: DataTypes.BIGINT,
        quantity: DataTypes.DECIMAL,
        timeFormat: DataTypes.STRING
    }, {
        tableName: 'agg_trades',
    });
    AggTrade.associate = function (models) {
        // associations can be defined here
    };
    return AggTrade;
};