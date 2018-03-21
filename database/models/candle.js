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
        symbol: DataTypes.STRING,
        timeFormat: DataTypes.STRING
    }, {
        tableName: 'candles',
    });
    Candle.associate = function (models) {
        // associations can be defined here
    };

    /**
     * Check if sequence of candles is continuous
     * @param {Array} candles List of candles
     * @return {boolean}
     */
    Candle.checkSequence = function(candles) {
        if (candles.length === 0) {
            return false;
        }

        let isCorrect = true;
        let prevCandle = null;
        for (let candle of candles) {
            if (!isCorrect) break;
            if (prevCandle === null) {
                prevCandle = candle;
                continue;
            }
            isCorrect = isCorrect && ((candle.openTime - prevCandle.closeTime) === 1);
            prevCandle = candle;
        }
        return isCorrect;
    };

    return Candle;
};