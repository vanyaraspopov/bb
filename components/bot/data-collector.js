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

    async getAggTrades(symbol, startTime, endTime) {
        let aggTrades = [];
        try {
            aggTrades = await this.bb.api.aggTrades({
                symbol,
                startTime,
                endTime
            });
        } catch (error) {
            this.bb.log.error(error);
        }
        return aggTrades;
    }

    async collectData() {
        let time = moment();
        let prevMinuteStart = moment(time).startOf('minute').subtract(1, 'minutes');
        let prevMinuteEnd = moment(time).startOf('minute');

        //  millisecond timestamps
        let prevMinuteStart_msts = prevMinuteStart.unix() * 1000;
        let prevMinuteEnd_msts = prevMinuteEnd.unix() * 1000 - 1;

        for (let symbol of this.config.symbols) {
            try {
                let count = await AggTrade.count({
                    where: {
                        symbol: symbol,
                        timeStart: prevMinuteStart_msts,
                        timeEnd: prevMinuteEnd_msts
                    }
                });
                if (count === 0) {
                    let aggTrades = await this.getAggTrades(symbol, prevMinuteStart_msts, prevMinuteEnd_msts);
                    let quantity = aggTrades.reduce((sum, trade) => sum + Number(trade.quantity), 0);
                    AggTrade.create({
                        symbol: symbol,
                        timeStart: prevMinuteStart_msts,
                        timeEnd: prevMinuteEnd_msts,
                        quantity: quantity.toFixed(this.config.quantityPrecision)
                    })
                }
            } catch (error) {
                this.bb.log.error(error);
            }
        }
    }

    run() {
        let collectDataPeriod = 60 * 1000;  //  ms
        let collectDataInterval = setInterval(() => this.collectData(), collectDataPeriod);
        this.collectData();
    }
}

module.exports = DataCollector;