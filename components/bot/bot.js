const binance = require('node-binance-api');
const db = require('../../database/db');
const math = require('mathjs');
const moment = require('moment');

const AggTrade = db.sequelize.models['AggTrade'];

let bot = {
    config: {
        symbol: 'ETHBTC',
        quantityPrecision: 8,
    },
    run() {
        let collectDataPeriod = 60 * 1000;  //  ms
        let collectDataInterval = setInterval(() => {
            console.log('I\'m bot, I\'m working...');
        }, collectDataPeriod);
    }
};

async function buy(symbol, quantity, price) {
    return await
    binance.buy(symbol, quantity, price, (error, response) => {
        if (error !== null) {
            throw error;
        } else {
            console.log("Limit Buy response", response);
            console.log("order id: " + response.orderId);
        }
    });
}

async function sell(symbol, quantity, price) {
    return await binance.sell(symbol, quantity, price, (error, response) => {
        if (error !== null) {
            throw error;
        } else {
            console.log("Limit Sell response", response);
            console.log("order id: " + response.orderId);
        }
    });
}

module.exports = bot;