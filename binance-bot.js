var binance = require('node-binance-api'),
    config = require('./config/config');

binance.options(config.get('binance'));
binance.bookTickers((error, ticker) => {
    console.log("bookTickers()", ticker);
    console.log("Price of BNB: ", ticker.BNBBTC);
});