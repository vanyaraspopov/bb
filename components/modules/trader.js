const db = require('../../database/db');
const Op = db.Sequelize.Op;
const moment = require('moment');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];
const Candle = db.sequelize.models['Candle'];
const Trade = db.sequelize.models['Trade'];

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
            id: 0
        }
    }

    /**
     * @inheritDoc
     */
    get tasks() {
        return [];
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
        return Trade.create(order);
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
                    [Op.lte]: timeStartMax.unix() * 1000
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
     * Checks if all previous orders are closed
     * @param symbol
     * @param mark
     * @returns {Promise<boolean>}
     */
    static async previousOrdersClosed(symbol, mark = 'trader') {
        let trades = await Trade.findAll({where: {symbol, mark, closed: 0}});
        return trades.length === 0;
    }
}

module.exports = Trader;