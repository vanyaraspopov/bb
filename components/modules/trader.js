const db = require('../../database/db');
const Op = db.Sequelize.Op;
const moment = require('moment');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];
const Candle = db.sequelize.models['Candle'];
const Order = db.sequelize.models['order'];

const PRECISION_QUANTITY = 8;

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
                action: this._work,
                interval: 60 * 1000,
                title: 'Main trading strategy'
            },
            {
                action: this._checkOpenedOrders,
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
     * @returns {order}
     * @private
     */
    _buy(symbol, price, quantity, takeProfit, stopLoss) {
        let time = moment();
        let order = {
            price,
            time: moment(time).unix() * 1000,
            timeFormat: moment(time).utc().format(this.bb.config.moment.format),
            quantity,
            takeProfit,
            stopLoss,
            symbol
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
    static _compareTradesQuantity(trades) {
        if (trades.length === 0) {
            throw new Error("Array of trades shouldn't be empty");
        }

        let firstPeriodQuantity = 0;
        let secondPeriodQuantity = 0;

        let isOdd = trades.length % 2 === 1;
        if (isOdd) {
            let middle = Math.floor(trades.length / 2);
            firstPeriodQuantity += trades[middle].quantity / 2;
            secondPeriodQuantity += trades[middle].quantity / 2;
        }

        let firstHalfLength = Math.floor(trades.length / 2);
        let secondHalfStart = Math.ceil(trades.length / 2);
        for (let i = 0; i < trades.length; i++) {
            if (i < firstHalfLength) {
                firstPeriodQuantity += trades[i].quantity;
            }
            if (i >= secondHalfStart) {
                secondPeriodQuantity += trades[i].quantity;
            }
        }

        firstPeriodQuantity = firstPeriodQuantity.toFixed(PRECISION_QUANTITY);
        secondPeriodQuantity = secondPeriodQuantity.toFixed(PRECISION_QUANTITY);

        return secondPeriodQuantity / firstPeriodQuantity;
    }

    /**
     * Compares candles' close prices of second and first half.
     * @param {Array} candles
     * @returns {boolean} True if average close price of second half is greater than in a first half.
     * @private
     */
    static _comparePrices(candles) {
        if (candles.length === 0) {
            return false;
        }
        let prices = candles.map(candle => candle.close);

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
     * @private
     */
    async _getLastCandles(symbol, period) {
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
        this._sortByProperty(candles, 'openTime', 'ASC');
        return candles;
    }

    /**
     * Returns last trades
     * @param {string} symbol
     * @param {int} period in minutes
     * @returns {Array}
     * @private
     */
    async _getLastTrades(symbol, period) {
        let timeStartMin = moment().subtract(period + 2, 'minutes');
        let lastTrades = await AggTrade.findAll({
            limit: period,
            order: [['timeStart', 'DESC']],
            where: {
                symbol: symbol,
                timeStart: {[Op.gte]: timeStartMin.unix() * 1000}
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
        this._sortByProperty(lastTrades, 'timeStart', 'ASC');
        return lastTrades;
    }

    /**
     * Checks if all previous orders were closed
     * @param symbol
     * @returns {Promise<boolean>}
     * @private
     */
    static async _previousOrdersClosed(symbol) {
        let orders = await Order.findAll({where: {symbol, closed: 0}});
        return orders.length === 0;
    }

    /**
     * Sort array of objects
     * @param {Array} array of objects with property "key"
     * @param {string} property Name of property to sort by
     * @param {string} direction ASC|DESC
     * @private
     */
    _sortByProperty(array, property, direction = 'ASC') {
        let asc = 1;
        if (direction === 'DESC') asc = -1;
        array.sort((a, b) => {
            if (a[property] > b[property]) {
                return asc;
            } else if (a[property] < b[property]) {
                return -asc;
            }
            return 0;
        });
    }

    async _work() {
        let moduleParams = await this.activeParams;
        let prices = await this.bb.api.prices();
        for (let mp of moduleParams) {
            try {
                let symbol = mp.symbol.symbol;
                let period = this.config.period;
                let lastTrades = await this._getLastTrades(symbol, period);
                let lastCandles = await this._getLastCandles(symbol, period);
                if (this._checks(symbol, lastTrades, lastCandles)) {
                    let params = JSON.parse(mp.params);
                    let ratioToBuy = Number(params['buy'].value);
                    let sellHigh = Number(params['sellHigh'].value);
                    let sellLow = Number(params['sellLow'].value);
                    let sum = Number(params['sum'].value);
                    let quantityRatio = Trader._compareTradesQuantity(lastTrades);
                    let priceIncreasing = Trader._comparePrices(lastCandles);
                    if (quantityRatio >= ratioToBuy && priceIncreasing) {
                        let price = prices[symbol];
                        let takeProfit = price * (1 + sellHigh / 100);
                        let stopLoss = price * (1 - sellLow / 100);
                        if (await Trader._previousOrdersClosed(symbol)) {
                            await this._buy(symbol, price, sum, takeProfit, stopLoss);
                        }
                    }
                }
            } catch (error) {
                this.bb.log.error(error);
            }
        }
    }

    async _checkOpenedOrders() {
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