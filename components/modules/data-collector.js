const db = require('../../database/db');
const moment = require('moment');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];
const Candle = db.sequelize.models['Candle'];
const Currency = db.sequelize.models['Currency'];

const QUANTITY_PRECISION = 8;

class DataCollector {

    constructor(bb) {
        this.bb = bb;
        this._symbols = undefined;
    }

    /**
     * Makes request through API and returns trades aggregated
     * @param symbol
     * @param startTime Unix timestamp, us
     * @param endTime Unix timestamp, us
     * @returns {Promise<Array>}
     */
    async getAggTrades(symbol, startTime, endTime) {
        let aggTrades = [];
        try {
            aggTrades = await this.bb.api.aggTrades({
                symbol,
                startTime,
                endTime
            });
        } catch (error) {
            this.bb.log.error(error);
        }
        return aggTrades;
    }

    /**
     * Creates new AggTrade record if not exists
     * @param {string} symbol
     * @param {int} timeStart
     * @param {Number} quantity
     * @returns {Promise<void>}
     * @private
     */
    async _createAggTrade(symbol, timeStart, quantity) {
        let count = await AggTrade.count({
            where: {symbol, timeStart}
        });
        if (count === 0) {
            let timeEnd = moment(timeStart).add(1, 'minutes').unix() * 1000 - 1;
            let timeFormat = moment(timeStart).utc().format(this.bb.config.moment.format);
            quantity = Number(quantity.toFixed(QUANTITY_PRECISION));
            return AggTrade.create({
                symbol,
                timeStart,
                timeEnd,
                quantity,
                timeFormat
            });
        }
    }

    /**
     * Returns an empty map: timestamp => quantity
     * @param timeStart
     * @param timeEnd
     * @returns {Object}
     * @private
     */
    static _getEmptyQuantitiesByMinute(timeStart, timeEnd) {
        let quantities = {};
        let start = moment(timeStart).utc();
        let end = moment(timeEnd).utc();
        if (start.unix() > end.unix()) {
            let temp = start;
            start = end;
            end = temp;
        }
        let current = moment(start);
        while (current.unix() <= end.unix()) {
            quantities[current.unix() * 1000] = 0;
            current.add(1, 'minutes');
        }
        return quantities;
    }

    /**
     * Returns map filled with quantities: timestamp => quantity
     * @param {Object} quantities Empty map
     * @param {Array} trades
     * @returns {Object}
     * @private
     */
    static _fillQuantities(quantities, trades) {
        for (let trade of trades) {
            let minute = moment(trade.timestamp).utc();
            let ts = moment(minute).startOf('minute').unix() * 1000;
            if (quantities[ts] === undefined) {
                quantities[ts] = 0;
            }
            quantities[ts] += Number(trade.quantity);
        }
        return quantities;
    }

    async getSymbols() {
        if (this._symbols !== undefined) {
            return this._symbols;
        }

        let symbols = [];
        try {
            let currencies = await Currency.findAll();
            for (let currency of currencies) {
                symbols.push(currency.quot + currency.base);
            }
        } catch (error) {
            this.bb.log.error(error);
        }

        this._symbols = symbols;
        return this._symbols;
    }

    async collectCandles(interval) {
        let time = moment();

        let minutes = Math.round(interval / 60 / 1000) * 5;
        let lastMinutes = [];
        for (let i = 0; i < minutes; i++) {
            let prevMinute = moment(time).subtract(i + 1, 'minutes');
            let prevMinuteStart = moment(prevMinute).startOf('minute').unix() * 1000;
            let prevMinuteEnd = moment(prevMinute).startOf('minute').add(1, 'minutes').unix() * 1000 - 1;
            lastMinutes.unshift({
                start: prevMinuteStart,
                end: prevMinuteEnd
            });
        }

        for (let symbol of await this.getSymbols()) {
            try {
                let candles = await this.bb.api.candles({
                    symbol: symbol,
                    interval: '1m',
                    startTime: lastMinutes[0].start,
                    endTime: lastMinutes[lastMinutes.length - 1].end,
                });
                for (let candle of candles) {
                    Candle.count({
                        where: {
                            symbol: symbol,
                            openTime: candle.openTime,
                            closeTime: candle.closeTime
                        }
                    }).then(count => {
                        if (count === 0) {
                            candle.symbol = symbol;
                            candle.timeFormat = moment(candle.openTime).utc().format(this.bb.config.moment.format);
                            return Candle.create(candle);
                        }
                    }).catch(error => {
                        this.bb.log.error(error);
                    });
                }
            } catch (error) {
                this.bb.log.error(error);
            }
        }

    }

    async collectAggTrades(interval) {
        let period = Math.round(interval / 60 / 1000) * 30;
        let time = moment().utc();
        let currentMinuteStart = moment(time).startOf('minute');
        let periodStart = moment(currentMinuteStart).subtract(period, 'minutes');

        let startTime = periodStart.unix() * 1000;
        let endTime = currentMinuteStart.unix() * 1000 - 1;
        let symbols = await this.getSymbols();
        for (let symbol of symbols) {
            try {
                let aggTrades = await this.getAggTrades(symbol, startTime, endTime);
                let quantities = DataCollector._getEmptyQuantitiesByMinute(startTime, endTime);
                DataCollector._fillQuantities(quantities, aggTrades);
                for (let timeStart in quantities) {
                    let ts = Number(timeStart);
                    await this._createAggTrade(symbol, ts, quantities[ts]);
                }
            } catch (error) {
                this.bb.log.error(error);
            }
        }
    }

    run() {
        let gettingAggTradesInterval = 60 * 1000;  //  ms
        setInterval(() => this.collectAggTrades(gettingAggTradesInterval), gettingAggTradesInterval);
        this.collectAggTrades().catch(err => this.bb.log.error(err));

        let gettingCandlesInterval = 5 * 60 * 1000;
        setInterval(() => this.collectCandles(gettingCandlesInterval), gettingCandlesInterval);
        this.collectCandles(gettingCandlesInterval).catch(err => this.bb.log.error(err));
    }
}

module.exports = DataCollector;