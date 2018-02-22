'use strict';
module.exports = (sequelize, DataTypes) => {
    var AggTrade = sequelize.define('AggTrade', {
        timeStart: DataTypes.BIGINT,
        timeEnd: DataTypes.BIGINT,
        quantity: DataTypes.DECIMAL
    }, {
        tableName: 'agg_trades',
    });
    AggTrade.associate = function (models) {
        // associations can be defined here
    };
    return AggTrade;
};