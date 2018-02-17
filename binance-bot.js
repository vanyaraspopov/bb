var binance = require('node-binance-api'),
    config = require('./config/config'),
    logger = require('./components/logger/logger');

binance.options(config.get('binance'));
binance.websockets.chart("BNBBTC", "1m", (symbol, interval, chart) => {
    let tick = binance.last(chart);
    const last = chart[tick].close;
    //console.log(chart);
    // Optionally convert 'chart' object to array:
    // let ohlc = binance.ohlc(chart);
    // console.log(symbol, ohlc);
    logger.info(symbol+" last price: "+last);
});