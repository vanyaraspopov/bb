const api = require('./components/api/api');
const config = require('./config/config.json');
const db = require('./database/db');
const logger = require('./components/logger/logger');
const utils = require('./components/utils/utils');

//  Modules
const DataCollector = require('./components/modules/data-collector');
const Pumper = require('./components/modules/pumper');
const Scalper = require('./components/modules/scalper');
const PriceWatcher = require('./components/modules/price-watcher');

let bb = {
    config,
    components: {
        api,
        db,
        logger,
        utils,
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
    get utils() {
        return this.components.utils;
    },

};

bb.components.dataCollector = new DataCollector(bb);
bb.components.pumper = new Pumper(bb);
bb.components.scalper = new Scalper(bb);
bb.components.priceWatcher = new PriceWatcher(bb);

module.exports = bb;