const db = require('../../database/db');
const Op = db.Sequelize.Op;
const moment = require('moment');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];
const Currency = db.sequelize.models['Currency'];
const Order = db.sequelize.models['order'];

const PRECISION_QUANTITY = 8;

let config = {
    period: 30
};

class Trader {

    constructor(bb) {
        this.bb = bb;
        this.config = config;
    }

    /**
     * Creates buy order
     * @param symbol
     * @param price
     * @param quantity
     * @returns {Promise}
     * @private
     */
    _buy(symbol, price, quantity) {
        let time = moment();
        let order = {
            price: price,
            time: moment(time).unix() * 1000,
            timeFormat: moment(time).utc().format(this.bb.config.moment.format),
            quantity: quantity,
            takeProfit: price * (1 + params['sellHigh'] / 100),
            stopLoss: price * (1 - params['sellLow'] / 100),
            symbol: symbol
        };
        return Order.create(order);
    }

    /**
     * Compares trades quantities of two last periods
     * @param {Array} trades Last trades data
     * @return {Number}
     */
    _compareTradesQuantity(trades) {
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
        try {
            let activeCurrencies = await Currency.findAll({where: {active: 1}});
            for (let currency of activeCurrencies) {
                let symbol = currency.quot + currency.base;
                let params = JSON.parse(currency.params);
                let period = this.config.period;
                let ratioToBuy = Number(params['buy']);
                let lastTrades = await this._getLastTrades(symbol, period);
                if (AggTrade.checkTradesSequence(lastTrades)) {
                    let quantityRatio = this._compareTradesQuantity(lastTrades);
                    if (quantityRatio >= ratioToBuy) {
                        let prices = await this.bb.api.prices();
                        let price = prices[symbol];
                        await this._buy(symbol, price, currency.sum);
                    }
                } else {
                    this.bb.log.error({
                        message: 'Last trades haven\'t pass checking',
                        symbol,
                        lastTrades
                    });
                }
            }
        } catch (error) {
            this.bb.log.error(error);
        }
    }

    /**
     * Main function
     */
    run() {
        let runPeriod = 60 * 1000;  //  ms
        let runInterval = setInterval(() => this._work(), runPeriod);
        this._work();
    }

}

module.exports = Trader;