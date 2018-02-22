'use strict';

const binance = require('node-binance-api');
const db = require('../../database/db');
const moment = require('moment');

const AggTrade = db.sequelize.models['AggTrade'];

let dataCollector = {
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

    let symbol = dataCollector.config.symbol;
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
            quantity: quantity.toFixed(dataCollector.config.quantityPrecision)
        });
        console.log("period", prevMinuteStart_msts, prevMinuteEnd_msts);
        console.log("response length:", response.length);
        console.log("total quantity:", quantity.toFixed(dataCollector.config.quantityPrecision));
    });
}

module.exports = dataCollector;