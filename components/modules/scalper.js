const db = require('../../database/db');

//  Models
const Candle = db.sequelize.models['Candle'];

const Trader = require('./trader');

class Scalper extends Trader {
    constructor(bb) {
        super(bb);
    }

    /**
     * @inheritDoc
     */
    get module() {
        return {
            id: 3,
            title: 'Скальпер',
            mark: 'scalper',
            pm2_name: 'bb.scalper'
        };
    }

    /**
     * @inheritDoc
     */
    get tasks() {
        return [
            {
                key: 'scalper_work',
                action: this.work,
                interval: 60 * 1000,
                title: 'Scalper trading strategy'
            },
            {
                key: 'scalper_check',
                action: this.checkActiveTrades,
                interval: 15 * 1000,
                title: 'Checking trades'
            },
            {
                key: 'scalper_watch_order',
                action: this.checkActiveTradesByOrders,
                interval: 15 * 1000,
                title: 'Watching orders'
            },
            {
                key: 'scalper_check_failed',
                action: this.deactivateFailedModuleParameters,
                interval: 20 * 1000,
                title: 'Checking failed trades'
            }
        ];
    }

    /**
     * Scalper trading strategy
     * @returns {Promise<void>}
     */
    async work() {
        let moduleParams = await this.activeParams;
        let prices = await this.bb.api.prices();
        for (let mp of moduleParams) {
            try {
                let symbol = mp.symbol;
                let params = JSON.parse(mp.params);
                let period = Number(params['period'].value || 0);
                let lastCandles = await this.getLastCandles(symbol.symbol, period);
                if (Candle.checkSequence(lastCandles)) {
                    let subsidence = Number(params['subsidence'].value);
                    let avgPrice = Candle.avgPrice(lastCandles);
                    let lastPrice = Number(prices[symbol.symbol]);
                    let priceToBuy = avgPrice * (1 - subsidence / 100);
                    if (lastPrice < priceToBuy) {
                        if (await Scalper.previousOrdersClosed(symbol.symbol, this.module.id) &&
                            !(await Trader.previousTradesFailed(symbol.symbol, this.module.id, 2))) {
                            let sum = Number(params['sum'].value);
                            let sellHigh = Number(params['sellHigh'].value);
                            let sellLow = Number(params['sellLow'].value);
                            let takeProfit = priceToBuy * (1 + sellHigh / 100);
                            let stopLoss = priceToBuy * (1 - sellLow / 100);
                            await this.trade(symbol, priceToBuy, sum, takeProfit, stopLoss);
                        }
                    }
                } else {
                    this.bb.log.error({
                        message: 'Last candles haven\'t pass checking',
                        symbol,
                        lastTrades: trades
                    });
                }
            } catch (error) {
                this.bb.log.error(error);
            }
        }
    }
}

module.exports = Scalper;