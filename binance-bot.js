var binance = require('node-binance-api'),
    bot = require('./components/bot/bot'),
    config = require('./config/config.json'),
    db = require('./database/db'),
    logger = require('./components/logger/logger');

bot.run();