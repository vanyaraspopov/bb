'use strict';
module.exports = (sequelize, DataTypes) => {
    var Candle = sequelize.define('Candle', {
        openTime: DataTypes.BIGINT,
        closeTime: DataTypes.BIGINT,
        open: DataTypes.DECIMAL,
        high: DataTypes.DECIMAL,
        low: DataTypes.DECIMAL,
        close: DataTypes.DECIMAL,
        volume: DataTypes.DECIMAL,
        quoteAssetVolume: DataTypes.DECIMAL,
        baseAssetVolume: DataTypes.DECIMAL,
        trades: DataTypes.INTEGER,
        symbol: DataTypes.STRING
    }, {
        tableName: 'candles',
    });
    Candle.associate = function (models) {
        // associations can be defined here
    };
    return Candle;
};