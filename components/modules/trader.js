const db = require('../../database/db');
const Op = db.Sequelize.Op;
const moment = require('moment');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];
const Candle = db.sequelize.models['Candle'];
const Order = db.sequelize.models['Order'];
const Symb = db.sequelize.models['Symb'];
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
            mark: 'trader',
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
     * Creates new createTrade
     * @param {Symb} symbol
     * @param {Number} price
     * @param {Number} quantity
     * @param {Number} takeProfit
     * @param {Number} stopLoss
     * @param {Number} ratio last volumes ratio
     */
    async createTrade(symbol, price, quantity, takeProfit, stopLoss, ratio = null) {
        let time = moment();
        let tradeData = {
            module_id: this.module.id,
            price: symbol.correctPrice(price),
            time: moment(time).unix() * 1000,
            timeFormat: moment(time).utc().format(this.bb.config.moment.format),
            quantity: symbol.correctQuantity(quantity),
            takeProfit: symbol.correctPrice(takeProfit),
            stopLoss: symbol.correctPrice(stopLoss),
            symbol: symbol.symbol,
            mark: this.module.mark,
            ratio: ratio ? ratio.toFixed(PRECISION_QUANTITY) : ratio
        };
        return Trade.create(tradeData);
    }

    /**
     * Checking status of opened orders
     * @returns {Promise<void>}
     */
    async checkActiveTrades() {
        if (this.bb.config['binance'].test) {
            return this.checkActiveTradesByPrices();
        }
    }

    /**
     * Deactivates module parameters which lead to failed trades.
     * @returns {Promise<void>}
     */
    async deactivateFailedModuleParameters() {
        let moduleParams = await this.activeParams;
        for (let mp of moduleParams) {
            let lastTradesFailed = await Trader.previousTradesFailed(mp.symbol.symbol, this.module.id, 2);
            if (lastTradesFailed) {
                mp.deactivate()
                    .catch(err => this.bb.log.error(err));
            }
        }
    }

    /**
     * Check prices and manage trades: set closed, success, etc.
     * For test mode.
     * @returns {Promise<void>}
     */
    async checkActiveTradesByPrices() {
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
            let timeToTakeProfit = currentPrice >= Number(trade['takeProfit']);
            let timeToStopLoss = currentPrice <= Number(trade['stopLoss']);
            let timeToSell = trade.checkExpired(30);
            if (timeToTakeProfit || timeToStopLoss || timeToSell) {
                trade
                    .update({
                        success: Boolean(Number(trade.price) < currentPrice),
                        closed: true
                    })
                    .catch(err => this.bb.log.error(err));
            }
        }
    }

    async checkActiveTradesByOrders() {
        if (this.bb.config['binance'].test) {
            return;
        }
        let trades = await Trade.findAll({
            where: {
                [Op.and]: [
                    {[Op.or]: [{module_id: 0}, {module_id: this.module.id}]},
                    {closed: 0}
                ]
            }
        });
        for (let trade of trades) {
            try {
                let order = await Order.findOne({where: {trade_id: trade.id}});
                if (order == null) {
                    return;
                }
                let symbol = await Symb.findOne({where: {id: order.symbol_id}});
                this.trackTrade(trade, symbol, order);
            } catch (err) {
                this.bb.log.error(err);
            }
        }
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
     * @param {string} symbol
     * @param {integer} module_id
     * @returns {Promise<boolean>}
     */
    static async previousOrdersClosed(symbol, module_id) {
        let trades = await Trade.findAll({
            where: {symbol, module_id, closed: 0}
        });
        return trades.length === 0;
    }

    /**
     * Checks if last <tradesCount> trades failed
     * @param {string} symbol
     * @param {Number} module_id
     * @param {Number} tradesCount Number of last trades to check
     * @returns {Promise<Boolean>}
     */
    static async previousTradesFailed(symbol, module_id, tradesCount = 2) {
        let trades = await Trade.findAll({
            where: {
                module_id: module_id,
                closed: 1,
                symbol: symbol
            },
            limit: tradesCount,
            order: [['id', 'DESC']]
        });
        if (trades.length < tradesCount) return false;
        return trades.every(trade => !trade.success);
    }

    //  Order management


    async cancelOrder(order) {
        if (order.symbol == null) {
            order = await Order.findById(order.id);
        }
        try {
            let symbol = order.symbol;
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
        try {
            Trader.prepareOrderOptions(symbol, options);
            if (Trader.validateOrderOptions(symbol, options)) {
                let exchangeOrder = await this.bb.api.order(options);
                if (exchangeOrder) {
                    let orderData = {
                        exchange_order_id: exchangeOrder.orderId,
                        trade_id: trade.id,
                        symbol_id: symbol.id,
                        symbol: exchangeOrder.symbol,
                        side: exchangeOrder.side,
                        type: exchangeOrder.type,
                        status: exchangeOrder.status,
                        origQty: Number(exchangeOrder.origQty),
                        executedQty: Number(exchangeOrder.executedQty),
                        price: Number(exchangeOrder.price),
                        time: exchangeOrder.transactTime
                    };
                    return Order.create(orderData);
                }
            }
        } catch (err) {
            this.bb.log.error(err);
        }
    }

    /**
     * Creates "LIMIT" order
     * @param {Trade} trade
     * @param {Symb} symbol
     * @param {string} side: "BUY" or "SELL"
     * @param {Number} price
     * @param {Number} quantity
     * @returns {Promise<Order>}
     */
    async placeLimitOrder(trade, symbol, side, price, quantity) {
        let options = {
            symbol: symbol.symbol,
            side,
            type: 'LIMIT',
            price,
            quantity
        };
        return this.createOrder(trade, symbol, options)
    }

    /**
     * Creates "MARKET" order
     * @param {Trade} trade
     * @param {Symb} symbol
     * @param {string} side: "BUY" or "SELL"
     * @param {Number} quantity
     * @returns {Promise<Order>}
     */
    async placeMarketOrder(trade, symbol, side, quantity) {
        let options = {
            symbol: symbol.symbol,
            side,
            type: 'MARKET',
            quantity
        };
        return this.createOrder(trade, symbol, options)
    }

    /**
     * Creates "TAKE_PROFIT_LIMIT" order
     * @param {Trade} trade
     * @param {Symb} symbol
     * @param {string} side: "BUY" or "SELL"
     * @param {Number} price
     * @param {Number} stopPrice
     * @param {Number} quantity
     * @returns {Promise<Order>}
     */
    async placeTakeProfitOrder(trade, symbol, side, price, stopPrice, quantity) {
        let options = {
            symbol: symbol.symbol,
            side,
            type: 'TAKE_PROFIT_LIMIT',
            price,
            stopPrice,
            quantity
        };
        return this.createOrder(trade, symbol, options)
    }

    /**
     * Creates "STOP_LOSS_LIMIT" order
     * @param {Trade} trade
     * @param {Symb} symbol
     * @param {string} side: "BUY" or "SELL"
     * @param {Number} price
     * @param {Number} stopPrice
     * @param {Number} quantity
     * @returns {Promise<Order>}
     */
    async placeStopLossOrder(trade, symbol, side, price, stopPrice, quantity) {
        let options = {
            symbol: symbol.symbol,
            side,
            type: 'STOP_LOSS_LIMIT',
            price,
            stopPrice,
            quantity
        };
        return this.createOrder(trade, symbol, options)
    }

    /**
     * Correction of numbers precision and converting to strings
     * @param symbol
     * @param options
     */
    static prepareOrderOptions(symbol, options) {
        let quantity = Number(options.quantity);
        if (quantity) {
            if (!symbol.checkLotSize(quantity.toFixed(8))) {
                options.quantity = symbol.correctQuantity(quantity.toFixed(8));
            }
        }

        let price = options.price;
        if (price) {
            if (!symbol.checkPrice(price.toFixed(8))) {
                options.price = symbol.correctPrice(price.toFixed(8));
            }
        }

        let stopPrice = options.stopPrice;
        if (stopPrice) {
            if (!symbol.checkPrice(stopPrice.toFixed(8))) {
                options.stopPrice = symbol.correctPrice(stopPrice.toFixed(8));
            }
        }
    }

    /**
     * Validating order options
     * @param symbol
     * @param options
     * @returns {boolean}
     */
    static validateOrderOptions(symbol, options) {
        let isCorrect = true;

        let orderType = options.type;
        if (orderType) {
            isCorrect &= symbol.checkOrderType(orderType);
        }

        let quantity = options.quantity;

        let price = options.price;
        if (price) {
            isCorrect &= symbol.checkFilters(price, quantity);
        }

        let stopPrice = options.stopPrice;
        if (stopPrice) {
            isCorrect &= symbol.checkFilters(stopPrice, quantity);
        }

        return Boolean(isCorrect);
    }

    /**
     * Tracking trade
     * @param {Trade} trade
     * @param {Symb} symbol
     * @param {Order} firstOrder
     * @returns {Promise<void>}
     */
    async trackTrade(trade, symbol, firstOrder) {
        if (firstOrder.status !== 'FILLED') {
            let _order = await this.waitOrderStatusFilled(symbol, firstOrder);
            await firstOrder.update({
                status: _order.status,
                executedQty: _order.executedQty
            });
        }
        let balance = await this.bb.getBalance(symbol.base);

        let cleanWatchCandlesSocket = this.bb.api.ws.candles(symbol.symbol, '1m', candle => {
            let currentPrice = Number(candle.close);
            let timeToTakeProfit = currentPrice >= Number(trade['takeProfit']);
            let timeToStopLoss = currentPrice <= Number(trade['stopLoss']);
            let timeToSell = trade.checkExpired(30);
            if (timeToTakeProfit || timeToStopLoss || timeToSell) {
                this.placeLimitOrder(trade, symbol, 'SELL', currentPrice, Number(balance['free']))
                    .then(order => {
                        cleanWatchCandlesSocket();
                        return this.waitOrderStatusFilled(order)
                            .then(_order => order.update({
                                status: _order.status,
                                executedQty: _order.executedQty
                            }));
                    })
                    .then(() => {
                        trade.update({
                            success: Boolean(Number(trade.price) < currentPrice),
                            closed: true
                        });
                    })
                    .catch(err => this.bb.log.error(err));
            }
        })
    }

    /**
     * Waiting until order status becomes for example "FILLED" or "CANCELED"
     * @param {Order} order
     * @param {string} status
     * @returns {Promise<any>}
     */
    async waitOrderStatus(order, status) {
        return new Promise((resolve, reject) => {
            let watchOrderStatusTaskKey = 'watch_order_' + order['id'] + '_status';
            let watchOrderStatusTask = {
                key: watchOrderStatusTaskKey,
                action: (interval) => {
                    this.bb.api
                        .getOrder({
                            symbol: order['symbol'],
                            orderId: order['exchange_order_id']
                        })
                        .then(_order => {
                            if (_order.status === status) {
                                this.stopTask(watchOrderStatusTaskKey);
                                resolve(_order);
                            }
                        })
                        .catch(err => this.bb.log.error(err));
                },
                interval: 3 * 1000,
                delay: 0
            };
            this.runTask(watchOrderStatusTask);
        });
    }

    /**
     * Waiting until order status becomes "FILLED"
     * @param {Order} order
     * @returns {Promise<any>}
     */
    async waitOrderStatusFilled(order) {
        return this.waitOrderStatus(order, 'FILLED');
    }

    /**
     * Waiting until order status becomes "CANCELED"
     * @param {Order} order
     * @returns {Promise<any>}
     */
    async waitOrderStatusCanceled(order) {
        return this.waitOrderStatus(order, 'CANCELED');
    }
}

module.exports = Trader;