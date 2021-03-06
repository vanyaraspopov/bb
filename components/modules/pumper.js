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
            mark: 'pumper',
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
            },
            {
                key: 'pumper_watch_order',
                action: this.checkActiveTradesByOrders,
                interval: 15 * 1000,
                title: 'Watching orders'
            },
            {
                key: 'pumper_check_failed',
                action: this.deactivateFailedModuleParameters,
                interval: 20 * 1000,
                title: 'Checking failed trades'
            }
        ];
    }

    /**
     * Helper method for checking data
     * @param symbol
     * @returns {boolean}
     * @private
     */
    _checks(symbol, candles) {
        let checksPassed = true;

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
     * Compares candles volumes of two last periods
     * @param {Array} candles Last candles data
     * @return {Number}
     */
    static compareVolumes(candles) {
        if (candles.length === 0) {
            return false;
        }
        let volumes = candles.map(candle => Number(candle.volume));

        let firstPeriodVolume = 0;
        let secondPeriodVolume = 0;

        let isOdd = volumes.length % 2 === 1;
        if (isOdd) {
            let middle = Math.floor(volumes.length / 2);
            firstPeriodVolume += volumes[middle] / 2;
            secondPeriodVolume += volumes[middle] / 2;
        }

        let firstHalfLength = Math.floor(volumes.length / 2);
        let secondHalfStart = Math.ceil(volumes.length / 2);
        for (let i = 0; i < volumes.length; i++) {
            if (i < firstHalfLength) {
                firstPeriodVolume += volumes[i];
            }
            if (i >= secondHalfStart) {
                secondPeriodVolume += volumes[i];
            }
        }

        return secondPeriodVolume / firstPeriodVolume;
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
     * @param candles
     * @param params
     * @returns {boolean}
     */
    static haveToBuy(candles, params) {
        let ratioToBuy = Number(params['buy'].value);
        let quantityRatio = Pumper.compareVolumes(candles);
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
                let lastCandles = await this.getLastCandles(symbol.symbol, period);
                if (this._checks(symbol.symbol, lastCandles)) {
                    let params = JSON.parse(mp.params);
                    if (Pumper.haveToBuy(lastCandles, params)) {
                        if (await Trader.previousOrdersClosed(symbol.symbol, this.module.id) &&
                            !(await Trader.previousTradesFailed(symbol.symbol, this.module.id, 2))) {
                            let price = prices[symbol.symbol];
                            let sellHigh = Number(params['sellHigh'].value);
                            let sellLow = Number(params['sellLow'].value);
                            let sum = Number(params['sum'].value);
                            let takeProfit = price * (1 + sellHigh / 100);
                            let stopLoss = price * (1 - sellLow / 100);
                            let quantity = sum / price;
                            let ratio = Pumper.compareVolumes(lastCandles);
                            let trade = await this.createTrade(symbol, price, quantity, takeProfit, stopLoss, ratio);
                            if (!this.bb.config['binance'].test) {
                                let order = await this.placeMarketOrder(trade, symbol, 'BUY', trade.quantity);
                                if (order) {
                                    this.trackTrade(trade, symbol, order)
                                        .catch(err => this.bb.log.error(err));
                                } else {
                                    trade.destroy();
                                }
                            }
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