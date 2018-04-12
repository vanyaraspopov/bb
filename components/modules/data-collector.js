const db = require('../../database/db');
const moment = require('moment');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];
const Candle = db.sequelize.models['Candle'];
const ModuleParameters = db.sequelize.models['ModuleParameters'];

const QUANTITY_PRECISION = 8;

const BBModule = require('./module');

class DataCollector extends BBModule {

    constructor(bb) {
        super(bb);
        this._symbols = undefined;
    }

    /**
     * @inheritDoc
     */
    get module() {
        return {
            id: 1,
            title: 'Сбор данных',
            pm2_name: 'bb.data-collector',
        }
    }

    /**
     * Async getter. Returns symbols defined in parameters of this module
     * @returns {Promise<*>}
     */
    get symbols() {
        return (async () => {
            if (this._symbols !== undefined) {
                return this._symbols;
            }

            let moduleParameters = await this.activeParams;

            let symbols = [];
            for (let mp of moduleParameters) {
                symbols.push(mp.symbol.symbol);
            }

            this._symbols = symbols;
            return this._symbols;
        })();
    }

    /**
     * @inheritDoc
     */
    get tasks() {
        return [
            {
                action: this.collectAggTrades,
                interval: 60 * 1000,
                title: 'Collecting aggregated trades info'
            },
            {
                action: this.collectCandles,
                interval: 60 * 1000,
                title: 'Collecting candles info'
            }
        ];
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
        quantity = Number(quantity.toFixed(QUANTITY_PRECISION));
        let trade = await AggTrade.findOne({
            where: {symbol, timeStart}
        });
        if (trade == null) {
            let timeEnd = moment(timeStart).add(1, 'minutes').unix() * 1000 - 1;
            let timeFormat = moment(timeStart).utc().format(this.bb.config.moment.format);
            return AggTrade.create({
                symbol,
                timeStart,
                timeEnd,
                quantity,
                timeFormat
            });
        }
        if (trade.quantity !== quantity) {
            return trade.update({
                quantity
            });
        }
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

    /**
     * If some of trades already exist in database then set 'id' property to them
     * @param trades
     * @returns {Promise<void>}
     */
    static async processExistingTrades(trades) {
        /* Query optimization */
        const Op = db.Sequelize.Op;
        let whereConditions = [];
        for (let trade of trades) {
            whereConditions.push({
                symbol: trade.symbol,
                timeStart: trade.timeStart
            });
        }

        let where = {
            [Op.or]: []
        };
        for (let cond of whereConditions) {
            where[Symbol.for('or')].push({
                [Op.and]: [
                    {symbol: cond.symbol},
                    {timeStart: cond.timeStart},
                ]
            });
        }
        /* Query optimization */

        //  Comparing trades and setting id if trade exists
        let existingTrades = await AggTrade.findAll({where});
        for (let i = 0; i < trades.length; i++) {
            let trade = trades[i];
            for (let k = 0; k < existingTrades.length; k++) {
                let existingTrade = existingTrades[k];
                if (trade.timeStart === existingTrade.timeStart && trade.symbol === existingTrade.symbol) {
                    trade.id = existingTrade.id;
                }
            }
        }
    }

    async collectCandles(interval) {
        let time = moment();

        let minutes = Math.round(interval / 60 / 1000) * 30;
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

        let candles = [];
        for (let symbol of await this.symbols) {
            try {
                let candles = await this.bb.api.candles({
                    symbol: symbol,
                    interval: '1m',
                    startTime: lastMinutes[0].start,
                    endTime: lastMinutes[lastMinutes.length - 1].end,
                });
                for (let candle of candles) {
                    let count = await Candle.count({
                        where: {
                            symbol: symbol,
                            openTime: candle.openTime,
                            closeTime: candle.closeTime
                        }
                    });
                    if (count === 0) {
                        candle.symbol = symbol;
                        candle.timeFormat = moment(candle.openTime).utc().format(this.bb.config.moment.format);
                        candles.push(candle);
                    }
                }
            } catch (error) {
                this.bb.log.error(error);
            }
        }

        Candle.bulkCreate(candles)
            .catch(err => this.bb.log.error(err));

    }

    async collectAggTrades(interval) {
        let period = Math.round(interval / 60 / 1000) * 30;
        let time = moment().startOf('minute').utc();
        let lastMinutesMap = this.bb.utils.lastMinutesMap(period, time);
        let borders = this.bb.utils.lastMinutesMapBorders(lastMinutesMap);
        let startTime = Number(borders.start);
        let endTime = Number(borders.end);

        let trades = [];
        let symbols = await this.symbols;
        for (let symbol of symbols) {
            try {
                let aggTrades = await this.getAggTrades(symbol, startTime, endTime);
                let quantities = this.bb.utils.lastMinutesMap(period, time, 0);
                DataCollector._fillQuantities(quantities, aggTrades);
                for (let timeStart in quantities) {
                    if (quantities.hasOwnProperty(timeStart)) {
                        let ts = Number(timeStart);
                        let trade = await this.prepareAggTrade(symbol, ts, quantities[ts]);
                        trades.push(trade);
                    }
                }
            } catch (error) {
                this.bb.log.error(error);
            }
        }

        DataCollector.processExistingTrades(trades)
            .then(() => {
                return AggTrade.bulkCreate(trades, {
                    updateOnDuplicate: ['quantity']
                });
            })
            .catch(err => this.bb.log.error(err));
    }

    /**
     * Preparing trade object fields for inserting to database
     * @param symbol
     * @param timeStart
     * @param quantity
     * @returns {Promise<{symbol: *, timeStart: *, timeEnd: number, quantity: number | *, timeFormat: string}>}
     */
    async prepareAggTrade(symbol, timeStart, quantity) {
        quantity = Number(quantity.toFixed(QUANTITY_PRECISION));
        let timeEnd = moment(timeStart).add(1, 'minutes').unix() * 1000 - 1;
        let timeFormat = moment(timeStart).utc().format(this.bb.config.moment.format);
        return {
            symbol,
            timeStart,
            timeEnd,
            quantity,
            timeFormat
        };
    }
}

module.exports = DataCollector;