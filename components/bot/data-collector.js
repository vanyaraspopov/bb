const db = require('../../database/db');
const moment = require('moment');

//  Models
const AggTrade = db.sequelize.models['AggTrade'];

let config = {
    symbols: ['ETHBTC', 'NEOBTC'],
    quantityPrecision: 8,
};

class DataCollector {

    constructor(bb) {
        this.bb = bb;
        this.config = config;
    }

    getAggTrades(symbol, startTime, endTime, cb) {
        this.bb.api.aggTrades(symbol,
            {
                startTime: startTime,
                endTime: endTime
            },
            (error, response) => {
                if (error) {
                    this.bb.log.error(error);
                    cb([]);
                }
                cb(response);
            });
    }

    collectData() {
        let time = moment();
        let prevMinuteStart = moment(time).startOf('minute').subtract(1, 'minutes');
        let prevMinuteEnd = moment(time).startOf('minute');

        //  millisecond timestamps
        let prevMinuteStart_msts = prevMinuteStart.unix() * 1000;
        let prevMinuteEnd_msts = prevMinuteEnd.unix() * 1000 - 1;

        for (let symbol of this.config.symbols) {
            AggTrade.count({
                where: {
                    symbol: symbol,
                    timeStart: prevMinuteStart_msts,
                    timeEnd: prevMinuteEnd_msts
                }
            }).then((count) => {
                if (count === 0) {
                    this.getAggTrades(symbol, prevMinuteStart_msts, prevMinuteEnd_msts, (response) => {
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
                            quantity: quantity.toFixed(this.config.quantityPrecision)
                        }).catch(error => {
                            this.bb.log.error(error);
                        });
                    });
                }
            }).catch(error => {
                this.bb.log.error(error);
            });
        }
    }

    run() {
        let collectDataPeriod = 60 * 1000;  //  ms
        let collectDataInterval = setInterval(() => this.collectData(), collectDataPeriod);
        this.collectData();
    }
}

module.exports = DataCollector;