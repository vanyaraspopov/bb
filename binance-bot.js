const binance = require('node-binance-api');
const bot = require('./components/bot/bot');
const config = require('./config/config.json');
const dataCollector = require('./components/bot/data-collector');
const db = require('./database/db');
const logger = require('./components/logger/logger');

dataCollector.run();
bot.run();