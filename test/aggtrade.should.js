const assert = require('chai').assert;
const expect = require('chai').expect;

const bb = require('../binance-bot');
const AggTrade = bb.models['AggTrade'];

describe('AggTrade model', () => {

    describe('checkTradesSequence', () => {

        it('should return false on empty', () => {
            expect(AggTrade.checkTradesSequence([])).to.equal(false);
        });

        it('should work correct', () => {
            let trades = [{
                timeStart: 10,
                timeEnd: 19
            }, {
                timeStart: 20,
                timeEnd: 29
            }, {
                timeStart: 30,
                timeEnd: 39
            }, {
                timeStart: 40,
                timeEnd: 49
            }, {
                timeStart: 50,
                timeEnd: 59
            }];
            let result = AggTrade.checkTradesSequence(trades);
            expect(result).to.equal(true);
        });

        it('should return false on discontinuity', () => {
            let trades = [{
                timeStart: 10,
                timeEnd: 19
            }, {
                timeStart: 20,
                timeEnd: 29
            }, /*{
                timeStart: 30,
                timeEnd: 39
            }, */{
                timeStart: 40,
                timeEnd: 49
            }, {
                timeStart: 50,
                timeEnd: 59
            }];
            let result = AggTrade.checkTradesSequence(trades);
            expect(result).to.equal(false);
        });

        it('should return false on duplicating', () => {
            let trades = [{
                timeStart: 10,
                timeEnd: 19
            }, {
                timeStart: 20,
                timeEnd: 29
            }, {
                timeStart: 30,
                timeEnd: 39
            }, {
                timeStart: 30,
                timeEnd: 39
            }, {
                timeStart: 40,
                timeEnd: 49
            }, {
                timeStart: 50,
                timeEnd: 59
            }];
            let result = AggTrade.checkTradesSequence(trades);
            expect(result).to.equal(false);
        });

    })

});