const binance = require('node-binance-api');
const math = require('mathjs');
const moment = require('moment');

let bot = {
    run() {
        let collectDataPeriod = 60 * 1000;  //  ms
        let collectDataInterval = setInterval(() => collectData(), collectDataPeriod);
        collectData();
    }
};

function getAggTrades(startTime, endTime, cb) {
    binance.aggTrades("ETHBTC",
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
    let prevMinuteEnd_msts = prevMinuteEnd.unix() * 1000;

    getAggTrades(prevMinuteStart_msts, prevMinuteEnd_msts, (response) => {
        let prices = [];
        let quantity = 0;
        for (let trade of response) {
            prices.push(Number(trade.p));
            quantity += Number(trade.q);
        }
        let avgPrice = prices.reduce((a, b) => a + b) / prices.length;
        console.log("response length:", response.length);
        console.log("avg price:", avgPrice);
        console.log("total quantity:", quantity);
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