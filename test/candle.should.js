const assert = require('chai').assert;
const expect = require('chai').expect;

const bb = require('../binance-bot');
const Candle = bb.models['Candle'];

describe('Candle model', () => {

    describe('checkSequence', () => {

        it('should return false on empty', () => {
            expect(Candle.checkSequence([])).to.equal(false);
        });

        it('should work correct', () => {
            let candles = [{
                openTime: 10,
                closeTime: 19
            }, {
                openTime: 20,
                closeTime: 29
            }, {
                openTime: 30,
                closeTime: 39
            }, {
                openTime: 40,
                closeTime: 49
            }, {
                openTime: 50,
                closeTime: 59
            }];
            let result = Candle.checkSequence(candles);
            expect(result).to.equal(true);
        });

        it('should return false on discontinuity', () => {
            let candles = [{
                openTime: 10,
                closeTime: 19
            }, {
                openTime: 20,
                closeTime: 29
            }, /*{
                openTime: 30,
                closeTime: 39
            }, */{
                openTime: 40,
                closeTime: 49
            }, {
                openTime: 50,
                closeTime: 59
            }];
            let result = Candle.checkSequence(candles);
            expect(result).to.equal(false);
        });

        it('should return false on duplicating', () => {
            let candles = [{
                openTime: 10,
                closeTime: 19
            }, {
                openTime: 20,
                closeTime: 29
            }, {
                openTime: 30,
                closeTime: 39
            }, {
                openTime: 30,
                closeTime: 39
            }, {
                openTime: 40,
                closeTime: 49
            }, {
                openTime: 50,
                closeTime: 59
            }];
            let result = Candle.checkSequence(candles);
            expect(result).to.equal(false);
        });

    });

});