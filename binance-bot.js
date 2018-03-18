const api = require('./components/api/api');
const config = require('./config/config.json');
const db = require('./database/db');
const logger = require('./components/logger/logger');

//  Classes
const Trader = require('./components/modules/trader');
const DataCollector = require('./components/modules/data-collector');

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
bb.components.trader = new Trader(bb);

module.exports = bb;