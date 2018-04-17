const db = require('../../database/db');
const Op = db.Sequelize.Op;
const moment = require('moment');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];
const Candle = db.sequelize.models['Candle'];
const Order = db.sequelize.models['order'];

const PRECISION_QUANTITY = 8;
const PRECISION_PRICE = 8;

let config = {
    period: 30
};

const BBModule = require('./module');
class Trader extends BBModule {

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
            title: 'Торговля',
            pm2_name: 'bb.trader',
        }
    }

    /**
     * @inheritDoc
     */
    get tasks() {
        return [
            {
                action: this.work,
                interval: 60 * 1000,
                title: 'Main trading strategy'
            },
            {
                action: this.checkOpenedOrders,
                interval: 10 * 1000,
                title: 'Checking order status'
            }
        ];
    }

    /**
     * Creates buy order
     * @param symbol
     * @param price
     * @param quantity
     * @param takeProfit
     * @param stopLoss
     * @param mark that points component creating an order
     * @param ratio last volumes ratio
     * @returns {order}
     */
    buy(symbol, price, quantity, takeProfit, stopLoss, mark = 'trader', ratio = null) {
        let time = moment();
        let order = {
            price,
            time: moment(time).unix() * 1000,
            timeFormat: moment(time).utc().format(this.bb.config.moment.format),
            quantity,
            takeProfit: takeProfit.toFixed(PRECISION_PRICE),
            stopLoss: stopLoss.toFixed(PRECISION_PRICE),
            symbol,
            mark,
            ratio: ratio ? ratio.toFixed(PRECISION_QUANTITY) : ratio
        };
        return Order.create(order);
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
     * Returns last candles
     * @param symbol
     * @param period
     * @returns {Promise<Array<Model>>}
     */
    async getLastCandles(symbol, period) {
        let openTimeMin = moment().subtract(period + 2, 'minutes');
        let candles = await Candle.findAll({
            limit: period,
            order: [['openTime', 'DESC']],
            where: {
                symbol,
                openTime: {[Op.gte]: openTimeMin.unix() * 1000}
            }
        });
        if (candles.length < period) {
            throw {
                message: "Data of last candles is missing.",
                symbol,
                period,
                openTimeMin: openTimeMin.utc().format(this.bb.config.moment.format)
            };
        }
        this.bb.utils.sortByProperty(candles, 'openTime', 'ASC');
        return candles;
    }

    /**
     * Returns last trades
     * @param {string} symbol
     * @param {int} period in minutes
     * @param {undefined|string|Object<Moment>} timeStartMax
     * @returns {Array}
     */
    async getLastTrades(symbol, period, timeStartMax = undefined) {
        if (timeStartMax !== undefined) {
            timeStartMax = moment(timeStartMax);
        } else {
            timeStartMax = moment();
        }
        let timeStartMin = moment(timeStartMax);
        timeStartMin.startOf('minute').subtract(period + 2, 'minutes');
        let lastTrades = await AggTrade.findAll({
            limit: period,
            order: [['timeStart', 'DESC']],
            where: {
                symbol: symbol,
                timeStart: {
                    [Op.gte]: timeStartMin.unix() * 1000,
                    [Op.lte]:  timeStartMax.unix() * 1000
                }
            }
        });
        if (lastTrades.length < period) {
            throw {
                message: "Data of last trades is missing.",
                symbol,
                period,
                timeStartMin: timeStartMin.utc().format(this.bb.config.moment.format)
            };
        }
        this.bb.utils.sortByProperty(lastTrades, 'timeStart', 'ASC');
        return lastTrades;
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
        let quantityRatio = Trader.compareTradesQuantity(trades);
        let priceIncreasing = Trader.comparePrices(candles);
        return quantityRatio >= ratioToBuy && priceIncreasing;
    }

    /**
     * Checks if all previous orders are closed
     * @param symbol
     * @param mark
     * @returns {Promise<boolean>}
     */
    static async previousOrdersClosed(symbol, mark = 'trader') {
        let orders = await Order.findAll({where: {symbol, mark, closed: 0}});
        return orders.length === 0;
    }

    /**
     * Main trading strategy
     * @returns {Promise<void>}
     */
    async work() {
        let moduleParams = await this.activeParams;
        let prices = await this.bb.api.prices();
        for (let mp of moduleParams) {
            try {
                let symbol = mp.symbol.symbol;
                let period = this.config.period;
                let lastTrades = await this.getLastTrades(symbol, period);
                let lastCandles = await this.getLastCandles(symbol, period);
                if (this._checks(symbol, lastTrades, lastCandles)) {
                    let params = JSON.parse(mp.params);
                    if (Trader.haveToBuy(lastTrades, lastCandles, params)) {
                        if (await Trader.previousOrdersClosed(symbol)) {
                            let price = prices[symbol];
                            let sellHigh = Number(params['sellHigh'].value);
                            let sellLow = Number(params['sellLow'].value);
                            let sum = Number(params['sum'].value);
                            let takeProfit = price * (1 + sellHigh / 100);
                            let stopLoss = price * (1 - sellLow / 100);
                            let quantityRatio = Trader.compareTradesQuantity(lastTrades);
                            await this.buy(symbol, price, sum, takeProfit, stopLoss, 'trader', quantityRatio);
                        }
                    }
                }
            } catch (error) {
                this.bb.log.error(error);
            }
        }
    }

    /**
     * Checking status of opened orders
     * @returns {Promise<void>}
     */
    async checkOpenedOrders() {
        let orders = await Order.findAll({where: {closed: 0}});
        let prices = await this.bb.api.prices();
        for (let order of orders) {
            let currentPrice = Number(prices[order.symbol]);
            if (currentPrice >= order.takeProfit) {
                order.update({success: true, closed: true})
                    .catch(err => this.bb.log.error(err));
            } else if (currentPrice <= order.stopLoss) {
                order.update({success: false, closed: true})
                    .catch(err => this.bb.log.error(err));
            }
        }
    }
}

module.exports = Trader;