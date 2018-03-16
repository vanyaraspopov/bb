const db = require('../../database/db');
const math = require('mathjs');
const moment = require('moment');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];
const Candle = db.sequelize.models['Candle'];
const Currency = db.sequelize.models['Currency'];

let config = {
    quantityPrecision: 8,
};

class DataCollector {

    constructor(bb) {
        this.bb = bb;
        this.config = config;

        this._symbols = undefined;
    }

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

    async collectCandles(gettingCandlesInterval) {
        let time = moment();

        let minutes = math.round(gettingCandlesInterval / 60 / 1000);
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

    async collectData() {
        let time = moment();
        let prevMinuteStart = moment(time).startOf('minute').subtract(1, 'minutes');
        let prevMinuteEnd = moment(time).startOf('minute');

        //  millisecond timestamps
        let prevMinuteStart_msts = prevMinuteStart.unix() * 1000;
        let prevMinuteEnd_msts = prevMinuteEnd.unix() * 1000 - 1;

        for (let symbol of await this.getSymbols()) {
            try {
                let count = await AggTrade.count({
                    where: {
                        symbol: symbol,
                        timeStart: prevMinuteStart_msts,
                        timeEnd: prevMinuteEnd_msts
                    }
                });
                if (count === 0) {
                    let aggTrades = await this.getAggTrades(symbol, prevMinuteStart_msts, prevMinuteEnd_msts);
                    let quantity = aggTrades.reduce((sum, trade) => sum + Number(trade.quantity), 0);
                    AggTrade.create({
                        symbol: symbol,
                        timeStart: prevMinuteStart_msts,
                        timeEnd: prevMinuteEnd_msts,
                        quantity: quantity.toFixed(this.config.quantityPrecision),
                        timeFormat: moment(prevMinuteStart).utc().format(this.bb.config.moment.format)
                    })
                }
            } catch (error) {
                this.bb.log.error(error);
            }
        }
    }

    run() {
        let collectDataPeriod = 60 * 1000;  //  ms
        let collectDataInterval = setInterval(() => this.collectData(), collectDataPeriod);
        this.collectData();

        let gettingCandlesInterval = 5 * 60 * 1000;
        setInterval(() => this.collectCandles(gettingCandlesInterval), gettingCandlesInterval);
        this.collectCandles(gettingCandlesInterval);
    }
}

module.exports = DataCollector;