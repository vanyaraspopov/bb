const assert = require('chai').assert;
const expect = require('chai').expect;

const bb = require('../../binance-bot');
const Symb = bb.models['Symb'];

describe('Symbol model', () => {

    let allowedOrderTypes = [
        'LIMIT', 'MARKET',
    ];

    let forbiddenOrderTypes = [
        'TAKE_PROFIT', 'STOP_LOSS'
    ];

    let minPrice = 0.00000010;
    let maxPrice = 100000.00000000;
    let tickSize = 0.00000010;

    let minQty = 0.01000000;
    let maxQty = 90000000.00000000;
    let stepSize = 0.01000000;

    let minNotional = 0.00100000;
    let filters = [
        {
            "filterType": "PRICE_FILTER",
            "minPrice": minPrice,
            "maxPrice": maxPrice,
            "tickSize": tickSize
        },
        {
            "filterType": "LOT_SIZE",
            "minQty": minQty,
            "maxQty": maxQty,
            "stepSize": stepSize
        },
        {
            "filterType": "MIN_NOTIONAL",
            "minNotional": minNotional
        }
    ];

    let testSymbolData = {
        base: 'TEST',
        quot: 'BTC',
    };
    testSymbolData.orderTypes = JSON.stringify(allowedOrderTypes);
    testSymbolData.filters = JSON.stringify(filters);

    describe('checkPrice', () => {

        it('should pass', () => {
            let symbol = Symb.build(testSymbolData);
            let price = minPrice + tickSize;
            let result = symbol.checkPrice(price);
            expect(result).to.equal(true);
        });

        it('shouldn\'t pass, low price', () => {
            let symbol = Symb.build(testSymbolData);
            let price = minPrice - tickSize;
            let result = symbol.checkPrice(price);
            expect(result).to.equal(false);
        });

        it('shouldn\'t pass, high price', () => {
            let symbol = Symb.build(testSymbolData);
            let price = maxPrice + tickSize;
            let result = symbol.checkPrice(price);
            expect(result).to.equal(false);
        });

        it('shouldn\'t pass, wrong step', () => {
            let symbol = Symb.build(testSymbolData);
            let price = minPrice + (tickSize / 2);
            let result = symbol.checkPrice(price);
            expect(result).to.equal(false);
        });

    });

    describe('checkLotSize', () => {

        it('should pass', () => {
            let symbol = Symb.build(testSymbolData);
            let quantity = minQty + stepSize;
            let result = symbol.checkLotSize(quantity);
            expect(result).to.equal(true);
        });

        it('shouldn\'t pass, low quantity', () => {
            let symbol = Symb.build(testSymbolData);
            let quantity = minQty - stepSize;
            let result = symbol.checkLotSize(quantity);
            expect(result).to.equal(false);
        });

        it('shouldn\'t pass, high quantity', () => {
            let symbol = Symb.build(testSymbolData);
            let quantity = maxQty + stepSize;
            let result = symbol.checkLotSize(quantity);
            expect(result).to.equal(false);
        });

        it('shouldn\'t pass, wrong step', () => {
            let symbol = Symb.build(testSymbolData);
            let quantity = minQty + (stepSize / 2);
            let result = symbol.checkLotSize(quantity);
            expect(result).to.equal(false);
        });

    });

    describe('minNotional', () => {

        it('should pass', () => {
            let symbol = Symb.build(testSymbolData);
            let result = symbol.checkMinNotional(maxPrice, maxQty);
            expect(result).to.equal(true);
        });

        it('shouldn\'t pass, too low', () => {
            let symbol = Symb.build(testSymbolData);
            let result = symbol.checkMinNotional(minPrice, minQty);
            expect(result).to.equal(false);
        });

    });

    describe('correctPrice', () => {

        it('should correct correctly', () => {
            let symbol = Symb.build(testSymbolData);
            let incorrectPrice = (minPrice * 2 + tickSize / 2).toFixed(8);
            let correctPrice = (minPrice * 2).toFixed(8);
            let result = symbol.correctPrice(incorrectPrice);
            expect(result).to.equal(correctPrice);
        });

        it('should work correctly with correct data', () => {
            let symbol = Symb.build(testSymbolData);
            let incorrectPrice = (minPrice * 2).toFixed(8);
            let correctPrice = (minPrice * 2).toFixed(8);
            let result = symbol.correctPrice(incorrectPrice);
            expect(result).to.equal(correctPrice);
        });

    });

    describe('correctQuantity', () => {

        it('should correct correctly', () => {
            let symbol = Symb.build(testSymbolData);
            let incorrect = (minQty * 2 + stepSize / 2).toFixed(8);
            let correct = (minQty * 2).toFixed(8);
            let result = symbol.correctQuantity(incorrect);
            expect(result).to.equal(correct);
        });

        it('should work correctly with correct data', () => {
            let symbol = Symb.build(testSymbolData);
            let incorrect = (minQty * 2).toFixed(8);
            let correct = (minQty * 2).toFixed(8);
            let result = symbol.correctQuantity(incorrect);
            expect(result).to.equal(correct);
        });

    });

});