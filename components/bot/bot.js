const binance = require('node-binance-api');
const math = require('mathjs');
const moment = require('moment');

let bot = {
    buy: buy,
    sell: sell,

    async run() {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        while (true) {
            let runExpect = 10 * 1000;  //  ms
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

        this.getAggTrades(limit, prevMinuteStart_msts, prevMinuteEnd_msts, (response) => {
            console.log("final response:", response.length);
        });
    },

    getAggTrades(limit, startTime, endTime, cb) {
        binance.aggTrades("ETHBTC",
            {
                limit: limit,
                startTime: startTime,
                endTime: endTime
            },
            (error, response) => {
                if (error) {
                    console.log(error);
                    cb([]);
                }
                if (response.length == limit) {
                    let middleTime = math.floor((startTime + endTime) / 2);
                    let firstHalfEnd = middleTime;
                    let secondHalfStart = middleTime + 1;
                    this.getAggTrades(limit, startTime, firstHalfEnd, (res1) => {
                        this.getAggTrades(limit, secondHalfStart, endTime, (res2) => {
                            cb(res1.concat(res2));
                        })
                    });
                } else {
                    cb(response);
                }
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