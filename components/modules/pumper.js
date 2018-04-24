const db = require('../../database/db');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];
const Candle = db.sequelize.models['Candle'];

let config = {
    period: 30
};

const Trader = require('./trader');

class Pumper extends Trader {
    constructor(bb) {
        super(bb);
        this.config = config;
    }

    /**
     * @inheritDoc
     */
    get module() {
        return {
            id: 2,
            title: 'Пампер',
            pm2_name: 'bb.pumper'
        };
    }

    /**
     * @inheritDoc
     */
    get tasks() {
        return [
            {
                key: 'pumper_work',
                action: this.work,
                interval: 60 * 1000,
                title: 'Pumper trading strategy'
            },
            {
                key: 'pumper_check',
                action: this.checkActiveTrades,
                interval: 15 * 1000,
                title: 'Checking trades'
            }
        ];
    }

    /**
     * Helper method for checking data
     * @param symbol
     * @returns {boolean}
     * @private
     */
    _checks(symbol, trades, candles) {
        let checksPassed = true;

        checksPassed &= AggTrade.checkTradesSequence(trades);
        if (!checksPassed) {
            this.bb.log.error({
                message: 'Last trades haven\'t pass checking',
                symbol,
                lastTrades: trades
            });
        }

        checksPassed &= Candle.checkSequence(candles);
        if (!checksPassed) {
            this.bb.log.error({
                message: 'Last candles haven\'t pass checking',
                symbol,
                lastTrades: trades
            });
        }

        return checksPassed;
    }

    /**
     * Compares trades quantities of two last periods
     * @param {Array} trades Last trades data
     * @return {Number}
     */
    static compareTradesQuantity(trades) {
        if (trades.length === 0) {
            throw new Error("Array of trades shouldn't be empty");
        }
        let quantities = trades.map(t => Number(t.quantity));

        let firstPeriodQuantity = 0;
        let secondPeriodQuantity = 0;

        let isOdd = quantities.length % 2 === 1;
        if (isOdd) {
            let middle = Math.floor(quantities.length / 2);
            firstPeriodQuantity += quantities[middle] / 2;
            secondPeriodQuantity += quantities[middle] / 2;
        }

        let firstHalfLength = Math.floor(quantities.length / 2);
        let secondHalfStart = Math.ceil(quantities.length / 2);
        for (let i = 0; i < quantities.length; i++) {
            if (i < firstHalfLength) {
                firstPeriodQuantity += quantities[i];
            }
            if (i >= secondHalfStart) {
                secondPeriodQuantity += quantities[i];
            }
        }

        return secondPeriodQuantity / firstPeriodQuantity;
    }

    /**
     * Compares candles' close prices of second and first half.
     * @param {Array} candles
     * @returns {boolean} True if average close price of second half is greater than in a first half.
     */
    static comparePrices(candles) {
        if (candles.length === 0) {
            return false;
        }
        let prices = candles.map(candle => Number(candle.close));

        let firstPeriodPrices = [];
        let secondPeriodPrices = [];

        let odd = (prices.length % 2) === 1;
        let middle = Math.floor(prices.length / 2);
        for (let i = 0; i < prices.length; i++) {
            let price = prices[i];
            if (i < middle || (odd && i === middle)) {
                firstPeriodPrices.push(price);
            }
            if (i >= middle) {
                secondPeriodPrices.push(price);
            }
        }

        let average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
        let avgFirst = average(firstPeriodPrices);
        let avgSecond = average(secondPeriodPrices);

        return avgSecond > avgFirst;
    }

    /**
     * Makes a decision to buy
     * @param trades
     * @param candles
     * @param params
     * @returns {boolean}
     */
    static haveToBuy(trades, candles, params) {
        let ratioToBuy = Number(params['buy'].value);
        let quantityRatio = Pumper.compareTradesQuantity(trades);
        let priceIncreasing = Pumper.comparePrices(candles);
        return quantityRatio >= ratioToBuy && priceIncreasing;
    }

    /**
     * Pumper trading strategy
     * @returns {Promise<void>}
     */
    async work() {
        let moduleParams = await this.activeParams;
        let prices = await this.bb.api.prices();
        for (let mp of moduleParams) {
            try {
                let symbol = mp.symbol;
                let period = this.config.period;
                let lastTrades = await this.getLastTrades(symbol.symbol, period);
                let lastCandles = await this.getLastCandles(symbol.symbol, period);
                if (this._checks(symbol.symbol, lastTrades, lastCandles)) {
                    let params = JSON.parse(mp.params);
                    if (Pumper.haveToBuy(lastTrades, lastCandles, params)) {
                        if (await Trader.previousOrdersClosed(symbol)) {
                            let price = prices[symbol.symbol];
                            let sellHigh = Number(params['sellHigh'].value);
                            let sellLow = Number(params['sellLow'].value);
                            let sum = Number(params['sum'].value);
                            let takeProfit = price * (1 + sellHigh / 100);
                            let stopLoss = price * (1 - sellLow / 100);
                            let quantityRatio = Pumper.compareTradesQuantity(lastTrades);
                            await this.trade(symbol, price, sum, takeProfit, stopLoss, 'trader', quantityRatio);
                        }
                    }
                }
            } catch (error) {
                this.bb.log.error(error);
            }
        }
    }
}

module.exports = Pumper;