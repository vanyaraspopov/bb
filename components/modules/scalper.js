const db = require('../../database/db');
const moment = require('moment');

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
            pm2_name: 'bb.scalper'
        };
    }

    /**
     * @inheritDoc
     */
    get tasks() {
        return [
            {
                action: this.work,
                interval: 60 * 1000,
                title: 'Scalper trading strategy'
            },
            {
                action: this.checkOpenedOrders,
                interval: 10 * 1000,
                title: 'Checking order status'
            }
        ];
    }

    /**
     * Returns average price for list of candles.
     * @param candles
     * @returns {Number|undefined}
     */
    static avgPrice(candles) {
        if (candles.length === 0) {
            return undefined;
        }
        let prices = candles.map(candle => candle.close);
        let sum = prices.reduce((prev, curr) => prev + curr, 0);
        return sum / candles.length;
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
                let symbol = mp.symbol.symbol;
                let params = JSON.parse(mp.params);
                let period = Number(params['period'].value || 0);
                let lastCandles = await this.getLastCandles(symbol, period);
                if (Candle.checkSequence(lastCandles)) {
                    let subsidence = Number(params['subsidence'].value);
                    let avgPrice = Scalper.avgPrice(lastCandles);
                    let lastPrice = Number(prices[symbol]);
                    let priceToBuy = avgPrice * (1 - subsidence / 100);
                    if (lastPrice < priceToBuy) {
                        let sum = Number(params['sum'].value);
                        let sellHigh = Number(params['sellHigh'].value);
                        let sellLow = Number(params['sellLow'].value);
                        let takeProfit = priceToBuy * (1 + sellHigh / 100);
                        let stopLoss = priceToBuy * (1 - sellLow / 100);
                        if (await Scalper.previousOrdersClosed(symbol)) {
                            await this.buy(symbol, priceToBuy, sum, takeProfit, stopLoss);
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