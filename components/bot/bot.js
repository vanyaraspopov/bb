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
        let collectDataInterval = setInterval(() => collectData(), collectDataPeriod);
        collectData();
    }
};

function getAggTrades(symbol, startTime, endTime, cb) {
    binance.aggTrades(symbol,
        {
            startTime: startTime,
            endTime: endTime
        },
        (error, response) => {
            if (error) {
                console.log(error);
                cb([]);
            }
            cb(response);
        });
}

function collectData() {
    let time = moment();
    let prevMinuteStart = moment(time).startOf('minute').subtract(1, 'minutes');
    let prevMinuteEnd = moment(time).startOf('minute');

    //  millisecond timestamps
    let prevMinuteStart_msts = prevMinuteStart.unix() * 1000;
    let prevMinuteEnd_msts = prevMinuteEnd.unix() * 1000 - 1;

    let symbol = bot.config.symbol;
    getAggTrades(symbol, prevMinuteStart_msts, prevMinuteEnd_msts, (response) => {
        let prices = [];
        let quantity = 0;
        for (let trade of response) {
            prices.push(Number(trade.p));
            quantity += Number(trade.q);
        }
        AggTrade.create({
            symbol: symbol,
            timeStart: prevMinuteStart_msts,
            timeEnd: prevMinuteEnd_msts,
            quantity: quantity.toFixed(bot.config.quantityPrecision)
        });
        console.log("period", prevMinuteStart_msts, prevMinuteEnd_msts);
        console.log("response length:", response.length);
        console.log("total quantity:", quantity.toFixed(bot.config.quantityPrecision));
    });
}

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