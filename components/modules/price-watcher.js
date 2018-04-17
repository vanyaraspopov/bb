const BBModule = require('./module');

class PriceWatcher extends BBModule {
    constructor(bb) {
        super(bb);
    }

    get module() {
        return {
            title: 'Наблюдатель',
            pm2_name: 'bb.price-watcher'
        }
    }

    get tasks() {
        return [
            {
                action: this.checkOpenedOrders,
                interval: 10 * 1000,
                title: 'Checking order status'
            }
        ]
    }

    /**
     * Checking status of opened orders
     * @returns {Promise<void>}
     */
    async checkOpenedOrders() {
        const Order = this.bb.models['order'];
        let orders = await Order.findAll({where: {closed: 0}});
        let prices = await this.bb.api.prices();
        for (let order of orders) {
            let currentPrice = Number(prices[order.symbol]);
            if (currentPrice >= order.takeProfit) {
                order.update({success: true, closed: true})
                    .catch(err => this.bb.log.error(err));
            } else if (currentPrice <= order.stopLoss) {
                order.update({success: false, closed: true})
                    .catch(err => this.bb.log.error(err));
            }
        }
    }
}

module.exports = PriceWatcher;