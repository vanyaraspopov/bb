const assert = require('chai').assert;
const expect = require('chai').expect;

const Trader = require('../components/modules/trader');

const bb = require('../binance-bot');
const trader = bb.components.trader;

describe('bb.trader', () => {

    describe('compareTradesQuantity', () => {

        it('should work correct', () => {
            let trades = [
                { quantity: 1 },
                { quantity: 1 },
                { quantity: 1 },
                { quantity: 1 },
                { quantity: 1 },
                { quantity: 2 },
                { quantity: 2 },
                { quantity: 2 },
                { quantity: 2 },
                { quantity: 2 },
                { quantity: 2 }
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(11 / 6);
        });

        it('should work correct 2', () => {
            let trades = [
                { quantity: 1 },
                { quantity: 1 },
                { quantity: 1 },
                { quantity: 1 },
                { quantity: 1 },
                { quantity: 2 },
                { quantity: 2 },
                { quantity: 2 },
                { quantity: 2 },
                { quantity: 2 }
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(2);
        });

        it('should work correct 3', () => {
            let trades = [
                { quantity: 2 },
                { quantity: 2 },
                { quantity: 2 },
                { quantity: 2 },
                { quantity: 2 },
                { quantity: 1 },
                { quantity: 1 },
                { quantity: 1 },
                { quantity: 1 },
                { quantity: 1 }
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(0.5);
        });

        it('should throw an error on empty array', () => {
            assert.throws(() => {
                Trader.compareTradesQuantity([]);
            }, Error, "Array of trades shouldn't be empty");
        });

        it('should return infinity', () => {
            let trades = [
                { quantity: 0 },
                { quantity: 1 }
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(Number.POSITIVE_INFINITY);
        });

    });

    describe('comparePrices', () => {

        it('should work correct', () => {
            let candles = [
                { close: 1 },
                { close: 1 },
                { close: 1 },
                { close: 1 },
                { close: 1 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 }
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(true);
        });

        it('should work correct 2', () => {
            let candles = [
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 1 },
                { close: 1 },
                { close: 1 },
                { close: 1 },
                { close: 1 },
                { close: 2 }
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

        it('should work correct 3', () => {
            let candles = [
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 },
                { close: 2 }
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

        it('should work correct with odd count of elements', () => {
            let candles = [
                { close: 2 },
                { close: 100 },
                { close: 2 }
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

        it('should work correct with odd count of elements 2', () => {
            let candles = [
                { close: 2 },
                { close: 100 },
                { close: 1 }
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

        it('should work correct with odd count of elements 3', () => {
            let candles = [
                { close: 1 },
                { close: 100 },
                { close: 2 }
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(true);
        });

        it('return false on empty array', () => {
            let result = Trader.comparePrices([]);
            expect(result).to.equal(false);
        });

        it('return false on 1 element', () => {
            let candles = [
                { close: 2 }
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

    });

});