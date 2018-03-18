'use strict';
module.exports = (sequelize, DataTypes) => {
    let AggTrade = sequelize.define('AggTrade', {
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

    /**
     * Check if sequence of trades is continuous
     * @param {Array} trades List of trades
     * @return {boolean}
     */
    AggTrade.checkTradesSequence = function(trades) {
        if (trades.length === 0) {
            return false;
        }

        let isCorrect = true;
        let prevTrade = null;
        for (let trade of trades) {
            if (!isCorrect) break;
            if (prevTrade === null) {
                prevTrade = trade;
                continue;
            }
            isCorrect = isCorrect && ((trade.timeStart - prevTrade.timeEnd) === 1);
            prevTrade = trade;
        }
        return isCorrect;
    };

    return AggTrade;
};