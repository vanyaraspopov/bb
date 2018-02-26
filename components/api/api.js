const api = require('node-binance-api');
const config = require('../../config/config.json')['binance'];
api.options(config);
module.exports = api;