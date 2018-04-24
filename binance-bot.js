const api = require('./components/api/api');
const config = require('./config/config.json');
const db = require('./database/db');
const logger = require('./components/logger/logger');
const moment = require('moment');
const utils = require('./components/utils/utils');

//  Modules
const DataCollector = require('./components/modules/data-collector');
const Pumper = require('./components/modules/pumper');
const Scalper = require('./components/modules/scalper');

let bb = {
    config,
    components: {
        api,
        db,
        logger,
        utils,
    },
    modules: {},

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

    /**
     * Aka service locator
     * @param module
     */
    registerModule(module) {
        let key = module.module['pm2_name'];
        this.modules[key] = module;
    },

    /**
     * Starts modules in defined order
     */
    startModules() {
        let second = moment().second();
        if (second > 0 && second < 20) {
            this.startDataCollector();
            setTimeout(this.startTradingModules, 30 * 1000)
        } else {
            let timeout = Math.abs(60 - second + 5);
            setTimeout(this.startDataCollector, timeout * 1000);
            setTimeout(this.startTradingModules, (timeout + 30) * 1000);
        }
    },

    startDataCollector() {
        bb.modules['bb.data-collector'].run();
    },

    startTradingModules() {
        bb.modules['bb.pumper'].run();
        bb.modules['bb.scalper'].run();
    }
};

bb.registerModule(new DataCollector(bb));
bb.registerModule(new Pumper(bb));
bb.registerModule(new Scalper(bb));

module.exports = bb;