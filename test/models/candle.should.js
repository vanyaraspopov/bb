const assert = require('chai').assert;
const expect = require('chai').expect;

const bb = require('../../binance-bot');
const Candle = bb.models['Candle'];

describe('Candle model', () => {

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
            let result = Candle.avgPrice(candles);
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
            let result = Candle.avgPrice(candles);
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
            let result = Candle.avgPrice(candles);
            expect(result).to.equal(2);
        });

        it('should work correct with strings', () => {
            let candles = [
                { close: '1' },
                { close: '1' },
                { close: '1' },
                { close: '1' },
                { close: '1' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' }
            ];
            let result = Candle.avgPrice(candles);
            expect(result).to.equal(17 / 11);
        });

        it('should work correct with strings 2', () => {
            let candles = [
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '1' },
                { close: '1' },
                { close: '1' },
                { close: '1' },
                { close: '1' },
                { close: '2' }
            ];
            let result = Candle.avgPrice(candles);
            expect(result).to.equal(17 / 11);
        });

        it('should work correct with strings 3', () => {
            let candles = [
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' },
                { close: '2' }
            ];
            let result = Candle.avgPrice(candles);
            expect(result).to.equal(2);
        });

        it('return undefined on empty array', () => {
            let result = Candle.avgPrice([]);
            expect(result).to.equal(undefined);
        });

    });

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