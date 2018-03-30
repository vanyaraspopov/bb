const assert = require('chai').assert;
const expect = require('chai').expect;

const Scalper = require('../components/modules/scalper');

const bb = require('../binance-bot');
const scalper = bb.components.scalper;

describe('Scalper', () => {

    describe('avgPrice', () => {

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
            let result = Scalper.avgPrice(candles);
            expect(result).to.equal(17 / 11);
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
            let result = Scalper.avgPrice(candles);
            expect(result).to.equal(17 / 11);
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
            let result = Scalper.avgPrice(candles);
            expect(result).to.equal(2);
        });

        it('return undefined on empty array', () => {
            let result = Scalper.avgPrice([]);
            expect(result).to.equal(undefined);
        });

    });

});