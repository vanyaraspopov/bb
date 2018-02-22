const binance = require('node-binance-api');
const db = require('../../database/db');
const logger = require('../../components/logger/logger');
const math = require('mathjs');
const moment = require('moment');

const AggTrade = db.sequelize.models['AggTrade'];

let bot = {
    config: {
        symbol: 'ETHBTC',
        quantityPrecision: 8,
    },
    run() {
        let runPeriod = 60 * 1000;  //  ms
        let runInterval = setInterval(() => work(), runPeriod);
        work();
    }
};

function work() {
    AggTrade.findAll({
        limit: 30,
        order: [
            ['id', 'DESC']
        ]
    }).then((lastTrades) => {
        lastTrades.sort((a, b) => {
            if (a.id > b.id) {
                return 1;
            } else if (a.id < b.id) {
                return -1;
            }
            return 0;
        });
        if (checkTradesSequence(lastTrades)) {
            let firstHalf = lastTrades.splice(0, 15);

            let firstHalfQuantity = 0;
            for (let trade of firstHalf) {
                firstHalfQuantity += trade.quantity
            }
            firstHalfQuantity = firstHalfQuantity.toFixed(bot.config.quantityPrecision);

            let secondHalfQuantity = 0;
            for (let trade of lastTrades) {
                secondHalfQuantity += trade.quantity
            }
            secondHalfQuantity = secondHalfQuantity.toFixed(bot.config.quantityPrecision);

            if (secondHalfQuantity > firstHalfQuantity * 5) {
                logger.info('Signal to do something', lastTrades);
            }
        } else {
            return new Promise((resolve, reject) => {
                reject('Last trades haven\'t pass checking');
            });
        }
    }).catch(error => {
        logger.error(error);
    });
}

/**
 * Check if sequence of trades is continuous
 * @param {Array} trades List of last trades
 * @return {boolean}
 */
function checkTradesSequence(trades) {
    let result = true;
    let prevTimeEnd;
    for (let trade of trades) {
        if (!result) break;
        if (prevTimeEnd === undefined) {
            prevTimeEnd = trade.timeEnd;
            continue;
        }
        result &= (trade.timeStart - prevTimeEnd) === 1;
        prevTimeEnd = trade.timeEnd;
    }
    return result;
}

module.exports = bot;