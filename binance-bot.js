const api = require('./components/api/api');
const config = require('./config/config.json');
const db = require('./database/db');
const logger = require('./components/logger/logger');

//  Classes
const Bot = require('./components/bot/bot');
const DataCollector = require('./components/bot/data-collector');

let bb = {
    config,
    components: {
        api,
        db,
        logger
    },

    //  Aliases
    get api() {
        return this.components.api;
    },
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

bb.components.dataCollector = new DataCollector(bb);
bb.components.bot = new Bot(bb);

module.exports = bb;