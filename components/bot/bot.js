const binance = require('node-binance-api');
const db = require('../../database/db');
const logger = require('../../components/logger/logger');
const math = require('mathjs');
const moment = require('moment');

const AggTrade = db.sequelize.models['AggTrade'];

const PRECISION_QUANTITY = 8;

let bot = {
    run: run
};

function _work() {
    for (let symbol of _tradingRules('symbols')) {
        let periodFull = _tradingRules(symbol, 'periodFull');
        let buyCoef = _tradingRules(symbol, 'buyCoef');

        AggTrade.findAll({
            limit: periodFull,
            order: [
                ['id', 'DESC']
            ],
            where: {
                symbol: symbol
            }
        }).then((lastTrades) => {
            lastTrades.sort((a, b) => {
                if (a.id > b.id) {
                    return 1;
                } else if (a.id < b.id) {
                    return -1;
                }
                return 0;
            });
            if (_checkTradesSequence(lastTrades)) {
                _compareTradesQuantity(
                    lastTrades,
                    parseInt(periodFull / 2),
                    buyCoef,
                    () => {
                        logger.info('Signal to do something', lastTrades);
                    }
                );
            } else {
                return new Promise((resolve, reject) => {
                    reject({
                        message: 'Last trades haven\'t pass checking',
                        symbol,
                        lastTrades
                    });
                });
            }
        }).catch(error => {
            logger.error(error);
        });
    }
}

/**
 * Check if sequence of trades is continuous
 * @param {Array} trades List of last trades
 * @return {boolean}
 */
function _checkTradesSequence(trades) {
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

/**
 * Compares trades quantities of two last periods
 * @param {Array} trades Last trades data
 * @param {int} period Length of each period, min
 * @param {Number} buyCoef Coefficient to buy
 * @param {Function} buyFunc Callback buy-function
 */
function _compareTradesQuantity(trades, period, buyCoef, buyFunc) {
    let lastPeriod = trades;
    let firstPeriod = lastPeriod.splice(0, period);

    let firstPeriodQuantity = 0;
    for (let trade of firstPeriod) {
        firstPeriodQuantity += trade.quantity
    }
    firstPeriodQuantity = firstPeriodQuantity.toFixed(PRECISION_QUANTITY);

    let secondPeriodQuantity = 0;
    for (let trade of lastPeriod) {
        secondPeriodQuantity += trade.quantity
    }
    secondPeriodQuantity = secondPeriodQuantity.toFixed(PRECISION_QUANTITY);

    if (secondPeriodQuantity / firstPeriodQuantity >= buyCoef) {
        buyFunc();
    }
}

/**
 * Main function
 */
function run() {
    let runPeriod = 60 * 1000;  //  ms
    let runInterval = setInterval(() => _work(), runPeriod);
    _work();
}

/**
 * Returns trading rules
 * @param {string} symbol Symbol's name
 * @param {string} rule Name of rule
 */
function _tradingRules(symbol, rule) {
    let rules = {
        common: {
            buyCoef: 5,
            periodFull: 30,
            quantityPrecision: 8
        },
        symbols: {
            'ETHBTC': {
                buyCoef: 5
            },
            'NEOBTC': {}
        }
    };
    if (symbol === undefined) return rules.common;
    if (symbol === 'symbols') {
        let symbols = [];
        for (let _symbol in rules.symbols) {
            if (rules.symbols.hasOwnProperty(_symbol)) {
                symbols.push(_symbol);
            }
        }
        return symbols;
    }
    if (rules.symbols[symbol] !== undefined) {
        if (rule !== undefined) {
            return rules.symbols[symbol][rule] ?
                rules.symbols[symbol][rule] :
                rules.common[rule];
        }
        return Object.assign(rules.common, rules.symbols[symbol]);
    }
}

module.exports = bot;