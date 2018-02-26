const client = require('binance-api-node').default;
const config = require('../../config/config.json')['binance'];

const api = client({
    apiKey: config['APIKEY'],
    apiSecret: config['APISECRET'],
});

module.exports = api;