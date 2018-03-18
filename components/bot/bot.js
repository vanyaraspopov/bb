const db = require('../../database/db');
const moment = require('moment');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];
const Currency = db.sequelize.models['Currency'];
const Order = db.sequelize.models['order'];

const PRECISION_QUANTITY = 8;

let config = {
    period: 30
};

class Bot {

    constructor(bb) {
        this.bb = bb;
        this.config = config;
    }

    /**
     * Check if sequence of trades is continuous
     * @param {Array} trades List of last trades
     * @return {boolean}
     */
    _checkTradesSequence(trades) {
        let result = true;
        let prevTimeEnd;
        for (let trade of trades) {
            if (!result) break;
            if (prevTimeEnd === undefined) {
                prevTimeEnd = trade.timeEnd;
                continue;
            }
            result &= (trade.timeStart - prevTimeEnd) === 1;
            prevTimeEnd = trade.timeEnd;
        }
        return result;
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
                let lastTrades = await AggTrade.findAll({
                    limit: period,
                    order: [['id', 'DESC']],
                    where: {symbol: symbol}
                });
                this._sortByProperty(lastTrades, 'id', 'ASC');
                if (this._checkTradesSequence(lastTrades)) {
                    let quantityRatio = this._compareTradesQuantity(lastTrades, parseInt(period / 2));
                    if (quantityRatio >= ratioToBuy) {
                        let prices = await this.bb.api.prices();
                        let price = prices[symbol];
                        let time = moment();
                        let order = {
                            price: price,
                            time: moment(time).unix() * 1000,
                            timeFormat: moment(time).utc().format(this.bb.config.moment.format),
                            quantity: currency.sum,
                            takeProfit: price * (1 + params['sellHigh'] / 100),
                            stopLoss: price * (1 - params['sellLow'] / 100),
                            symbol: symbol
                        };
                        Order.create(order);
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

module.exports = Bot;