const binance = require('node-binance-api');
const config = require('./config/config.json');
const dataCollector = require('./components/bot/data-collector');
const db = require('./database/db');
const logger = require('./components/logger/logger');

//  Classes
const Bot = require('./components/bot/bot');

let bb = {
    config,
    components: {
        binance,
        db,
        logger
    },

    //  Aliases
    get db() {
        return this.components.db
    },
    get log() {
        return this.components.logger;
    },
    get models() {
        return db.sequelize.models;
    },

};

dataCollector.run();

bb.components.bot = new Bot(bb);
bb.components.bot.run();