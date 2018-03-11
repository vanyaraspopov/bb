const db = require('../../database/db');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];
const Currency = db.sequelize.models['Currency'];

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
     * @param {int} period Length of each period, min
     * @return {Number}
     */
    _compareTradesQuantity(trades, period) {
        let lastPeriod = trades;
        let firstPeriod = lastPeriod.splice(0, period);

        let firstPeriodQuantity = 0;
        for (let trade of firstPeriod) {
            firstPeriodQuantity += trade.quantity
        }
        firstPeriodQuantity = firstPeriodQuantity.toFixed(PRECISION_QUANTITY);

        let secondPeriodQuantity = 0;
        for (let trade of lastPeriod) {
            secondPeriodQuantity += trade.quantity
        }
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
                let ratioToBuy = params['buy'];
                let lastTrades = await AggTrade.findAll({
                    limit: period,
                    order: [['id', 'DESC']],
                    where: {symbol: symbol}
                });
                this._sortByProperty(lastTrades, 'id', 'ASC');
                if (this._checkTradesSequence(lastTrades)) {
                    let quantityRatio = this._compareTradesQuantity(lastTrades, parseInt(period / 2));
                    if (quantityRatio >= ratioToBuy) {
                        this.bb.log.info('Signal to do something', lastTrades);
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