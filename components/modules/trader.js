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
            id: 0,
            title: 'Трейдер',
            pm2_name: '',
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
     * @returns {*}
     */
    buy(symbol, price, quantity, takeProfit, stopLoss, mark = 'trader', ratio = null) {
        let time = moment();
        let trade = {
            module_id: this.module.id,
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
        return Trade.create(trade);
    }

    /**
     * Checking status of opened orders
     * @returns {Promise<void>}
     */
    async checkActiveTrades() {
        if (this.bb.config['binance'].test) {
            return this.checkActiveTradesByPrices();
        } else {
            return this.checkActiveTradesByOrders();
        }
    }

    /**
     * Check prices and manage trades: set closed, success, etc.
     * For test mode.
     * @returns {Promise<void>}
     */
    async checkActiveTradesByPrices() {
        const Trade = this.bb.models['Trade'];
        let trades = await Trade.findAll({
            where: {
                [Op.and]: [
                    {[Op.or]: [{module_id: 0}, {module_id: this.module.id}]},
                    {closed: 0}
                ]
            }
        });
        let prices = await this.bb.api.prices();
        for (let trade of trades) {
            let currentPrice = Number(prices[trade.symbol]);
            if (currentPrice >= trade.takeProfit) {
                trade.update({success: true, closed: true})
                    .catch(err => this.bb.log.error(err));
            } else if (currentPrice <= trade.stopLoss) {
                trade.update({success: false, closed: true})
                    .catch(err => this.bb.log.error(err));
            }
        }
    }

    async checkActiveTradesByOrders() {
        //TODO:checking trades' statuses by watching orders
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

    //  Order management


    async cancelOrder(order) {
        if (order.symbol == null) {
            order = await Order.findById(order.id, {include: ['symbol']});
        }
        try {
            let symbol = order.symbol.symbol;
            let orderId = order.exchange_order_id;
            let result = await this.bb.api.cancelOrder({symbol, orderId});
        } catch (err) {
            this.bb.log.error(err);
        }
    }

    /**
     * Creates order on exchange
     * @param trade
     * @param symbol
     * @param options
     * @returns {void|Promise<*>}
     */
    async createOrder(trade, symbol, options) {
        if (this.bb.config['binance'].test) {
            return;
        }
        try {
            let exchangeOrder = await this.bb.api.order(options);
            let orderData = {
                exchange_order_id: exchangeOrder.orderId,
                trade_id: trade.id,
                symbol_id: symbol.id,
                side: exchangeOrder.side,
                type: exchangeOrder.type,
                status: exchangeOrder.status,
                origQty: Number(exchangeOrder.origQty),
                executedQty: Number(exchangeOrder.executedQty),
                price: Number(exchangeOrder.price),
                time: exchangeOrder.transactTime
            };
            return Order.create(orderData);
        } catch (err) {
            this.bb.log.error(err);
        }
    }
}

module.exports = Trader;