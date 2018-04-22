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
                action: this.checkActiveTrades,
                interval: 10 * 1000,
                title: 'Checking order status'
            }
        ]
    }

    /**
     * Checking status of opened orders
     * @returns {Promise<void>}
     */
    async checkActiveTrades() {
        const Trade = this.bb.models['Trade'];
        let trades = await Trade.findAll({where: {closed: 0}});
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
}

module.exports = PriceWatcher;