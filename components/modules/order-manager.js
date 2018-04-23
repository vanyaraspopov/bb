const db = require('../../database/db');

//  Models
const Order = db.sequelize.models['Order'];

const BBModule = require('./module');

class OrderManager extends BBModule {
    constructor(bb) {
        super(bb);
    }

    get module() {
        return {
            title: 'Управление ордерами',
            pm2_name: 'bb.order-manager'
        }
    }

    get tasks() {
        return []
    }

    async cancelOrder(order) {
        if (order.symbol == null) {
            order = await Order.findById(order.id, {include: ['symbol']});
        }
        try {
            let symbol = order.symbol.symbol;
            let orderId = order.exchange_order_id;
            let result = await this.bb.api.cancelOrder({symbol, orderId});
        } catch(err) {
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

module.exports = OrderManager;