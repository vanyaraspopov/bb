const binance = require('node-binance-api');
const math = require('mathjs');
const moment = require('moment');

let bot = {
    buy: buy,
    sell: sell,

    async run() {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        while (true) {
            let runExpect = 60 * 1000;  //  ms
            let runStart = moment();

            this.work();

            let runEnd = moment();
            let runLength = runEnd - runStart;
            if (runLength < runExpect) {
                let runWait = runExpect - runLength;
                await delay(runWait);
            }
        }
    },

    work() {
        let time = moment();
        let prevMinuteStart = moment(time).startOf('minute').subtract(1, 'minutes');
        let prevMinuteEnd = moment(time).startOf('minute');

        //  millisecond timestamps
        let limit = 500;
        let prevMinuteStart_msts = prevMinuteStart.unix() * 1000;
        let prevMinuteEnd_msts = prevMinuteEnd.unix() * 1000;

        this.getAggTrades(prevMinuteStart_msts, prevMinuteEnd_msts, (response) => {
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
    },

    getAggTrades(startTime, endTime, cb) {
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