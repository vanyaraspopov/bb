const assert = require('chai').assert;
const expect = require('chai').expect;

const bb = require('../binance-bot');
const trader = bb.components.trader;

describe('bb.trader', () => {

    describe('_compareTradesQuantity', () => {

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
            let result = Trader._compareTradesQuantity(trades);
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
            let result = Trader._compareTradesQuantity(trades);
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
            let result = Trader._compareTradesQuantity(trades);
            expect(result).to.equal(0.5);
        });

        it('should throw an error on empty array', () => {
            assert.throws(() => {
                Trader._compareTradesQuantity([]);
            }, Error, "Array of trades shouldn't be empty");
        });

        it('should return infinity', () => {
            let trades = [
                { quantity: 0 },
                { quantity: 1 }
            ];
            let result = Trader._compareTradesQuantity(trades);
            expect(result).to.equal(Number.POSITIVE_INFINITY);
        });

    });

});