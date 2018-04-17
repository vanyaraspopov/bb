'use strict';
module.exports = (sequelize, DataTypes) => {
    let Candle = sequelize.define('Candle', {
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
     * Returns average price for list of candles.
     * @param candles
     * @returns {Number|undefined}
     */
    Candle.avgPrice = function (candles) {
        if (candles.length === 0) {
            return undefined;
        }
        let prices = candles.map(candle => Number(candle.close));
        let sum = prices.reduce((prev, curr) => prev + curr, 0);
        return sum / candles.length;
    };

    /**
     * Check if sequence of candles is continuous
     * @param {Array} candles List of candles
     * @return {boolean}
     */
    Candle.checkSequence = function (candles) {
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