const assert = require('chai').assert;
const expect = require('chai').expect;
const moment = require('moment');

const Trader = require('../components/modules/trader');

const bb = require('../binance-bot');
const trader = bb.components.trader;

describe('bb.trader', () => {

    describe('compareTradesQuantity', () => {

        it('should work correct', () => {
            let trades = [
                {quantity: 1},
                {quantity: 1},
                {quantity: 1},
                {quantity: 1},
                {quantity: 1},
                {quantity: 2},
                {quantity: 2},
                {quantity: 2},
                {quantity: 2},
                {quantity: 2},
                {quantity: 2}
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(11 / 6);
        });

        it('should work correct 2', () => {
            let trades = [
                {quantity: 1},
                {quantity: 1},
                {quantity: 1},
                {quantity: 1},
                {quantity: 1},
                {quantity: 2},
                {quantity: 2},
                {quantity: 2},
                {quantity: 2},
                {quantity: 2}
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(2);
        });

        it('should work correct 3', () => {
            let trades = [
                {quantity: 2},
                {quantity: 2},
                {quantity: 2},
                {quantity: 2},
                {quantity: 2},
                {quantity: 1},
                {quantity: 1},
                {quantity: 1},
                {quantity: 1},
                {quantity: 1}
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(0.5);
        });

        it('should work correct with strings', () => {
            let trades = [
                {quantity: '1'},
                {quantity: '1'},
                {quantity: '1'},
                {quantity: '1'},
                {quantity: '1'},
                {quantity: '2'},
                {quantity: '2'},
                {quantity: '2'},
                {quantity: '2'},
                {quantity: '2'},
                {quantity: '2'}
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(11 / 6);
        });

        it('should work correct with strings 2', () => {
            let trades = [
                {quantity: '1'},
                {quantity: '1'},
                {quantity: '2'},
                {quantity: '1'},
                {quantity: '1'},
                {quantity: '2'},
                {quantity: '2'},
                {quantity: '1'},
                {quantity: '2'},
                {quantity: '2'}
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(9 / 6);
        });

        it('should work correct with strings 3', () => {
            let trades = [
                {quantity: '2'},
                {quantity: '2'},
                {quantity: '1'},
                {quantity: '2'},
                {quantity: '2'},
                {quantity: '1'},
                {quantity: '1'},
                {quantity: '2'},
                {quantity: '1'},
                {quantity: '1'}
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(6 / 9);
        });

        it('should work correct with real data', () => {
            let trades = [
                {
                    "id": 163475,
                    "timeStart": 1522747800000,
                    "timeEnd": 1522747859999,
                    "quantity": 23694,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030930"
                },
                {
                    "id": 163491,
                    "timeStart": 1522747860000,
                    "timeEnd": 1522747919999,
                    "quantity": 1253,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030931"
                },
                {
                    "id": 163507,
                    "timeStart": 1522747920000,
                    "timeEnd": 1522747979999,
                    "quantity": 2136,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030932"
                },
                {
                    "id": 163523,
                    "timeStart": 1522747980000,
                    "timeEnd": 1522748039999,
                    "quantity": 2915,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030933"
                },
                {
                    "id": 163539,
                    "timeStart": 1522748040000,
                    "timeEnd": 1522748099999,
                    "quantity": 81692,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030934"
                },
                {
                    "id": 163555,
                    "timeStart": 1522748100000,
                    "timeEnd": 1522748159999,
                    "quantity": 9922,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030935"
                },
                {
                    "id": 163571,
                    "timeStart": 1522748160000,
                    "timeEnd": 1522748219999,
                    "quantity": 3714,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030936"
                },
                {
                    "id": 163587,
                    "timeStart": 1522748220000,
                    "timeEnd": 1522748279999,
                    "quantity": 7708,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030937"
                },
                {
                    "id": 163603,
                    "timeStart": 1522748280000,
                    "timeEnd": 1522748339999,
                    "quantity": 21572,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030938"
                },
                {
                    "id": 163619,
                    "timeStart": 1522748340000,
                    "timeEnd": 1522748399999,
                    "quantity": 3839,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030939"
                },
                {
                    "id": 163635,
                    "timeStart": 1522748400000,
                    "timeEnd": 1522748459999,
                    "quantity": 2846,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030940"
                },
                {
                    "id": 163651,
                    "timeStart": 1522748460000,
                    "timeEnd": 1522748519999,
                    "quantity": 3727,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030941"
                },
                {
                    "id": 163667,
                    "timeStart": 1522748520000,
                    "timeEnd": 1522748579999,
                    "quantity": 16891,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030942"
                },
                {
                    "id": 163683,
                    "timeStart": 1522748580000,
                    "timeEnd": 1522748639999,
                    "quantity": 81201,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030943"
                },
                {
                    "id": 163699,
                    "timeStart": 1522748640000,
                    "timeEnd": 1522748699999,
                    "quantity": 349415,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030944"
                },
                {
                    "id": 163715,
                    "timeStart": 1522748700000,
                    "timeEnd": 1522748759999,
                    "quantity": 28689,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030945"
                },
                {
                    "id": 163731,
                    "timeStart": 1522748760000,
                    "timeEnd": 1522748819999,
                    "quantity": 45455,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030946"
                },
                {
                    "id": 163747,
                    "timeStart": 1522748820000,
                    "timeEnd": 1522748879999,
                    "quantity": 21280,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030947"
                },
                {
                    "id": 163763,
                    "timeStart": 1522748880000,
                    "timeEnd": 1522748939999,
                    "quantity": 7522,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030948"
                },
                {
                    "id": 163779,
                    "timeStart": 1522748940000,
                    "timeEnd": 1522748999999,
                    "quantity": 11412,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030949"
                },
                {
                    "id": 163795,
                    "timeStart": 1522749000000,
                    "timeEnd": 1522749059999,
                    "quantity": 1678,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030950"
                },
                {
                    "id": 163811,
                    "timeStart": 1522749060000,
                    "timeEnd": 1522749119999,
                    "quantity": 27326,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030951"
                },
                {
                    "id": 163827,
                    "timeStart": 1522749120000,
                    "timeEnd": 1522749179999,
                    "quantity": 68968,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030952"
                },
                {
                    "id": 163843,
                    "timeStart": 1522749180000,
                    "timeEnd": 1522749239999,
                    "quantity": 11924,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030953"
                },
                {
                    "id": 163859,
                    "timeStart": 1522749240000,
                    "timeEnd": 1522749299999,
                    "quantity": 87998,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030954"
                },
                {
                    "id": 163875,
                    "timeStart": 1522749300000,
                    "timeEnd": 1522749359999,
                    "quantity": 1942,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030955"
                },
                {
                    "id": 163891,
                    "timeStart": 1522749360000,
                    "timeEnd": 1522749419999,
                    "quantity": 6075,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030956"
                },
                {
                    "id": 163907,
                    "timeStart": 1522749420000,
                    "timeEnd": 1522749479999,
                    "quantity": 1538779,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030957"
                },
                {
                    "id": 163923,
                    "timeStart": 1522749480000,
                    "timeEnd": 1522749539999,
                    "quantity": 927867,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030958"
                },
                {
                    "id": 163939,
                    "timeStart": 1522749540000,
                    "timeEnd": 1522749599999,
                    "quantity": 3406,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030959"
                }
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(2790321 / 612525);
        });

        it('should throw an error on empty array', () => {
            assert.throws(() => {
                Trader.compareTradesQuantity([]);
            }, Error, "Array of trades shouldn't be empty");
        });

        it('should return infinity', () => {
            let trades = [
                {quantity: 0},
                {quantity: 1}
            ];
            let result = Trader.compareTradesQuantity(trades);
            expect(result).to.equal(Number.POSITIVE_INFINITY);
        });

    });

    describe('comparePrices', () => {

        it('should work correct', () => {
            let candles = [
                {close: 1},
                {close: 1},
                {close: 1},
                {close: 1},
                {close: 1},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2}
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(true);
        });

        it('should work correct 2', () => {
            let candles = [
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 1},
                {close: 1},
                {close: 1},
                {close: 1},
                {close: 1},
                {close: 2}
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

        it('should work correct 3', () => {
            let candles = [
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2},
                {close: 2}
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

        it('should work correct with strings', () => {
            let candles = [
                {close: '1'},
                {close: '1'},
                {close: '1'},
                {close: '1'},
                {close: '1'},
                {close: '0'},
                {close: '0'},
                {close: '2'},
                {close: '4'},
                {close: '4'},
                {close: '2'}
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(true);
        });

        it('should work correct with strings 2', () => {
            let candles = [
                {close: '0'},
                {close: '0'},
                {close: '2'},
                {close: '4'},
                {close: '4'},
                {close: '1'},
                {close: '1'},
                {close: '1'},
                {close: '1'},
                {close: '1'},
                {close: '2'}
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

        it('should work correct with strings 3', () => {
            let candles = [
                {close: '2'},
                {close: '2'},
                {close: '2'},
                {close: '2'},
                {close: '2'},
                {close: '2'},
                {close: '2'},
                {close: '2'},
                {close: '2'},
                {close: '2'},
                {close: '2'}
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

        it('should work correct with odd count of elements', () => {
            let candles = [
                {close: 2},
                {close: 100},
                {close: 2}
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

        it('should work correct with odd count of elements 2', () => {
            let candles = [
                {close: 2},
                {close: 100},
                {close: 1}
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

        it('should work correct with odd count of elements 3', () => {
            let candles = [
                {close: 1},
                {close: 100},
                {close: 2}
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
                {close: 2}
            ];
            let result = Trader.comparePrices(candles);
            expect(result).to.equal(false);
        });

    });

    describe('getLastTrades', () => {

        it('should work correct', async () => {
            let time = moment.utc('2018-04-03 10:00:04');
            let trades = [
                {
                    "id": 163491,
                    "timeStart": 1522747860000,
                    "timeEnd": 1522747919999,
                    "quantity": 1253,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030931"
                },
                {
                    "id": 163507,
                    "timeStart": 1522747920000,
                    "timeEnd": 1522747979999,
                    "quantity": 2136,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030932"
                },
                {
                    "id": 163523,
                    "timeStart": 1522747980000,
                    "timeEnd": 1522748039999,
                    "quantity": 2915,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030933"
                },
                {
                    "id": 163539,
                    "timeStart": 1522748040000,
                    "timeEnd": 1522748099999,
                    "quantity": 81692,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030934"
                },
                {
                    "id": 163555,
                    "timeStart": 1522748100000,
                    "timeEnd": 1522748159999,
                    "quantity": 9922,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030935"
                },
                {
                    "id": 163571,
                    "timeStart": 1522748160000,
                    "timeEnd": 1522748219999,
                    "quantity": 3714,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030936"
                },
                {
                    "id": 163587,
                    "timeStart": 1522748220000,
                    "timeEnd": 1522748279999,
                    "quantity": 7708,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030937"
                },
                {
                    "id": 163603,
                    "timeStart": 1522748280000,
                    "timeEnd": 1522748339999,
                    "quantity": 21572,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030938"
                },
                {
                    "id": 163619,
                    "timeStart": 1522748340000,
                    "timeEnd": 1522748399999,
                    "quantity": 3839,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030939"
                },
                {
                    "id": 163635,
                    "timeStart": 1522748400000,
                    "timeEnd": 1522748459999,
                    "quantity": 2846,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030940"
                },
                {
                    "id": 163651,
                    "timeStart": 1522748460000,
                    "timeEnd": 1522748519999,
                    "quantity": 3727,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030941"
                },
                {
                    "id": 163667,
                    "timeStart": 1522748520000,
                    "timeEnd": 1522748579999,
                    "quantity": 16891,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030942"
                },
                {
                    "id": 163683,
                    "timeStart": 1522748580000,
                    "timeEnd": 1522748639999,
                    "quantity": 81201,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030943"
                },
                {
                    "id": 163699,
                    "timeStart": 1522748640000,
                    "timeEnd": 1522748699999,
                    "quantity": 349415,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030944"
                },
                {
                    "id": 163715,
                    "timeStart": 1522748700000,
                    "timeEnd": 1522748759999,
                    "quantity": 28689,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030945"
                },
                {
                    "id": 163731,
                    "timeStart": 1522748760000,
                    "timeEnd": 1522748819999,
                    "quantity": 45455,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030946"
                },
                {
                    "id": 163747,
                    "timeStart": 1522748820000,
                    "timeEnd": 1522748879999,
                    "quantity": 21280,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030947"
                },
                {
                    "id": 163763,
                    "timeStart": 1522748880000,
                    "timeEnd": 1522748939999,
                    "quantity": 7522,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030948"
                },
                {
                    "id": 163779,
                    "timeStart": 1522748940000,
                    "timeEnd": 1522748999999,
                    "quantity": 11412,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030949"
                },
                {
                    "id": 163795,
                    "timeStart": 1522749000000,
                    "timeEnd": 1522749059999,
                    "quantity": 1678,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030950"
                },
                {
                    "id": 163811,
                    "timeStart": 1522749060000,
                    "timeEnd": 1522749119999,
                    "quantity": 27326,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030951"
                },
                {
                    "id": 163827,
                    "timeStart": 1522749120000,
                    "timeEnd": 1522749179999,
                    "quantity": 68968,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030952"
                },
                {
                    "id": 163843,
                    "timeStart": 1522749180000,
                    "timeEnd": 1522749239999,
                    "quantity": 11924,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030953"
                },
                {
                    "id": 163859,
                    "timeStart": 1522749240000,
                    "timeEnd": 1522749299999,
                    "quantity": 87998,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030954"
                },
                {
                    "id": 163875,
                    "timeStart": 1522749300000,
                    "timeEnd": 1522749359999,
                    "quantity": 1942,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030955"
                },
                {
                    "id": 163891,
                    "timeStart": 1522749360000,
                    "timeEnd": 1522749419999,
                    "quantity": 6075,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030956"
                },
                {
                    "id": 163907,
                    "timeStart": 1522749420000,
                    "timeEnd": 1522749479999,
                    "quantity": 1538779,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030957"
                },
                {
                    "id": 163923,
                    "timeStart": 1522749480000,
                    "timeEnd": 1522749539999,
                    "quantity": 927867,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030958"
                },
                {
                    "id": 163939,
                    "timeStart": 1522749540000,
                    "timeEnd": 1522749599999,
                    "quantity": 3406,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030959"
                },
                {
                    "id": 163955,
                    "timeStart": 1522749600000,
                    "timeEnd": 1522749659999,
                    "quantity": 139175,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804031000"
                }
            ];
            let result = await trader.getLastTrades('ZILBTC', 30, time);
            let values = result.map(t => t.dataValues);
            expect(values).to.deep.equal(trades);
        });

    });

    describe('haveToBuy', () => {

        it('should not buy', () => {
            let trades = [
                {
                    "id": 163475,
                    "timeStart": 1522747800000,
                    "timeEnd": 1522747859999,
                    "quantity": 23694,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030930"
                },
                {
                    "id": 163491,
                    "timeStart": 1522747860000,
                    "timeEnd": 1522747919999,
                    "quantity": 1253,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030931"
                },
                {
                    "id": 163507,
                    "timeStart": 1522747920000,
                    "timeEnd": 1522747979999,
                    "quantity": 2136,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030932"
                },
                {
                    "id": 163523,
                    "timeStart": 1522747980000,
                    "timeEnd": 1522748039999,
                    "quantity": 2915,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030933"
                },
                {
                    "id": 163539,
                    "timeStart": 1522748040000,
                    "timeEnd": 1522748099999,
                    "quantity": 81692,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030934"
                },
                {
                    "id": 163555,
                    "timeStart": 1522748100000,
                    "timeEnd": 1522748159999,
                    "quantity": 9922,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030935"
                },
                {
                    "id": 163571,
                    "timeStart": 1522748160000,
                    "timeEnd": 1522748219999,
                    "quantity": 3714,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030936"
                },
                {
                    "id": 163587,
                    "timeStart": 1522748220000,
                    "timeEnd": 1522748279999,
                    "quantity": 7708,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030937"
                },
                {
                    "id": 163603,
                    "timeStart": 1522748280000,
                    "timeEnd": 1522748339999,
                    "quantity": 21572,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030938"
                },
                {
                    "id": 163619,
                    "timeStart": 1522748340000,
                    "timeEnd": 1522748399999,
                    "quantity": 3839,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030939"
                },
                {
                    "id": 163635,
                    "timeStart": 1522748400000,
                    "timeEnd": 1522748459999,
                    "quantity": 2846,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030940"
                },
                {
                    "id": 163651,
                    "timeStart": 1522748460000,
                    "timeEnd": 1522748519999,
                    "quantity": 3727,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030941"
                },
                {
                    "id": 163667,
                    "timeStart": 1522748520000,
                    "timeEnd": 1522748579999,
                    "quantity": 16891,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030942"
                },
                {
                    "id": 163683,
                    "timeStart": 1522748580000,
                    "timeEnd": 1522748639999,
                    "quantity": 81201,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030943"
                },
                {
                    "id": 163699,
                    "timeStart": 1522748640000,
                    "timeEnd": 1522748699999,
                    "quantity": 349415,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030944"
                },
                {
                    "id": 163715,
                    "timeStart": 1522748700000,
                    "timeEnd": 1522748759999,
                    "quantity": 28689,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030945"
                },
                {
                    "id": 163731,
                    "timeStart": 1522748760000,
                    "timeEnd": 1522748819999,
                    "quantity": 45455,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030946"
                },
                {
                    "id": 163747,
                    "timeStart": 1522748820000,
                    "timeEnd": 1522748879999,
                    "quantity": 21280,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030947"
                },
                {
                    "id": 163763,
                    "timeStart": 1522748880000,
                    "timeEnd": 1522748939999,
                    "quantity": 7522,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030948"
                },
                {
                    "id": 163779,
                    "timeStart": 1522748940000,
                    "timeEnd": 1522748999999,
                    "quantity": 11412,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030949"
                },
                {
                    "id": 163795,
                    "timeStart": 1522749000000,
                    "timeEnd": 1522749059999,
                    "quantity": 1678,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030950"
                },
                {
                    "id": 163811,
                    "timeStart": 1522749060000,
                    "timeEnd": 1522749119999,
                    "quantity": 27326,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030951"
                },
                {
                    "id": 163827,
                    "timeStart": 1522749120000,
                    "timeEnd": 1522749179999,
                    "quantity": 68968,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030952"
                },
                {
                    "id": 163843,
                    "timeStart": 1522749180000,
                    "timeEnd": 1522749239999,
                    "quantity": 11924,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030953"
                },
                {
                    "id": 163859,
                    "timeStart": 1522749240000,
                    "timeEnd": 1522749299999,
                    "quantity": 87998,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030954"
                },
                {
                    "id": 163875,
                    "timeStart": 1522749300000,
                    "timeEnd": 1522749359999,
                    "quantity": 1942,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030955"
                },
                {
                    "id": 163891,
                    "timeStart": 1522749360000,
                    "timeEnd": 1522749419999,
                    "quantity": 6075,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030956"
                },
                {
                    "id": 163907,
                    "timeStart": 1522749420000,
                    "timeEnd": 1522749479999,
                    "quantity": 1538779,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030957"
                },
                {
                    "id": 163923,
                    "timeStart": 1522749480000,
                    "timeEnd": 1522749539999,
                    "quantity": 927867,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030958"
                },
                {
                    "id": 163939,
                    "timeStart": 1522749540000,
                    "timeEnd": 1522749599999,
                    "quantity": 3406,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030959"
                }
            ];
            let candles = [
                {
                    "id": 163091,
                    "openTime": 1522747860000,
                    "closeTime": 1522747919999,
                    "open": 6.21E-6,
                    "high": 6.21E-6,
                    "low": 6.21E-6,
                    "close": 6.21E-6,
                    "volume": 1253,
                    "quoteAssetVolume": 0.00778113,
                    "baseAssetVolume": 1253,
                    "trades": 3,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030931"
                },
                {
                    "id": 163107,
                    "openTime": 1522747920000,
                    "closeTime": 1522747979999,
                    "open": 6.21E-6,
                    "high": 6.21E-6,
                    "low": 6.21E-6,
                    "close": 6.21E-6,
                    "volume": 2136,
                    "quoteAssetVolume": 0.01326456,
                    "baseAssetVolume": 2136,
                    "trades": 2,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030932"
                },
                {
                    "id": 163123,
                    "openTime": 1522747980000,
                    "closeTime": 1522748039999,
                    "open": 6.21E-6,
                    "high": 6.21E-6,
                    "low": 6.21E-6,
                    "close": 6.21E-6,
                    "volume": 2915,
                    "quoteAssetVolume": 0.01810215,
                    "baseAssetVolume": 2915,
                    "trades": 2,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030933"
                },
                {
                    "id": 163139,
                    "openTime": 1522748040000,
                    "closeTime": 1522748099999,
                    "open": 6.21E-6,
                    "high": 6.21E-6,
                    "low": 6.2E-6,
                    "close": 6.2E-6,
                    "volume": 81692,
                    "quoteAssetVolume": 0.46507932,
                    "baseAssetVolume": 74892,
                    "trades": 13,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030934"
                },
                {
                    "id": 163155,
                    "openTime": 1522748100000,
                    "closeTime": 1522748159999,
                    "open": 6.21E-6,
                    "high": 6.21E-6,
                    "low": 6.21E-6,
                    "close": 6.21E-6,
                    "volume": 9922,
                    "quoteAssetVolume": 0.06161562,
                    "baseAssetVolume": 9922,
                    "trades": 3,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030935"
                },
                {
                    "id": 163171,
                    "openTime": 1522748160000,
                    "closeTime": 1522748219999,
                    "open": 6.22E-6,
                    "high": 6.22E-6,
                    "low": 6.22E-6,
                    "close": 6.22E-6,
                    "volume": 3714,
                    "quoteAssetVolume": 0.02310108,
                    "baseAssetVolume": 3714,
                    "trades": 3,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030936"
                },
                {
                    "id": 163187,
                    "openTime": 1522748220000,
                    "closeTime": 1522748279999,
                    "open": 6.22E-6,
                    "high": 6.22E-6,
                    "low": 6.22E-6,
                    "close": 6.22E-6,
                    "volume": 7708,
                    "quoteAssetVolume": 0.04794376,
                    "baseAssetVolume": 7708,
                    "trades": 3,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030937"
                },
                {
                    "id": 163203,
                    "openTime": 1522748280000,
                    "closeTime": 1522748339999,
                    "open": 6.22E-6,
                    "high": 6.22E-6,
                    "low": 6.22E-6,
                    "close": 6.22E-6,
                    "volume": 21572,
                    "quoteAssetVolume": 0.13417784,
                    "baseAssetVolume": 21572,
                    "trades": 7,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030938"
                },
                {
                    "id": 163219,
                    "openTime": 1522748340000,
                    "closeTime": 1522748399999,
                    "open": 6.22E-6,
                    "high": 6.22E-6,
                    "low": 6.22E-6,
                    "close": 6.22E-6,
                    "volume": 3839,
                    "quoteAssetVolume": 0.01821838,
                    "baseAssetVolume": 2929,
                    "trades": 2,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030939"
                },
                {
                    "id": 163235,
                    "openTime": 1522748400000,
                    "closeTime": 1522748459999,
                    "open": 6.22E-6,
                    "high": 6.22E-6,
                    "low": 6.22E-6,
                    "close": 6.22E-6,
                    "volume": 2846,
                    "quoteAssetVolume": 0.00347076,
                    "baseAssetVolume": 558,
                    "trades": 2,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030940"
                },
                {
                    "id": 163251,
                    "openTime": 1522748460000,
                    "closeTime": 1522748519999,
                    "open": 6.22E-6,
                    "high": 6.22E-6,
                    "low": 6.22E-6,
                    "close": 6.22E-6,
                    "volume": 3727,
                    "quoteAssetVolume": 0.02318194,
                    "baseAssetVolume": 3727,
                    "trades": 4,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030941"
                },
                {
                    "id": 163267,
                    "openTime": 1522748520000,
                    "closeTime": 1522748579999,
                    "open": 6.22E-6,
                    "high": 6.22E-6,
                    "low": 6.2E-6,
                    "close": 6.2E-6,
                    "volume": 16891,
                    "quoteAssetVolume": 0.08990962,
                    "baseAssetVolume": 14471,
                    "trades": 11,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030942"
                },
                {
                    "id": 163283,
                    "openTime": 1522748580000,
                    "closeTime": 1522748639999,
                    "open": 6.21E-6,
                    "high": 6.21E-6,
                    "low": 6.19E-6,
                    "close": 6.2E-6,
                    "volume": 81201,
                    "quoteAssetVolume": 0.3132488,
                    "baseAssetVolume": 50524,
                    "trades": 23,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030943"
                },
                {
                    "id": 163299,
                    "openTime": 1522748640000,
                    "closeTime": 1522748699999,
                    "open": 6.22E-6,
                    "high": 6.22E-6,
                    "low": 6.18E-6,
                    "close": 6.2E-6,
                    "volume": 349415,
                    "quoteAssetVolume": 1.2836649,
                    "baseAssetVolume": 207585,
                    "trades": 36,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030944"
                },
                {
                    "id": 163315,
                    "openTime": 1522748700000,
                    "closeTime": 1522748759999,
                    "open": 6.21E-6,
                    "high": 6.21E-6,
                    "low": 6.2E-6,
                    "close": 6.21E-6,
                    "volume": 28689,
                    "quoteAssetVolume": 0.12254193,
                    "baseAssetVolume": 19733,
                    "trades": 16,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030945"
                },
                {
                    "id": 163331,
                    "openTime": 1522748760000,
                    "closeTime": 1522748819999,
                    "open": 6.21E-6,
                    "high": 6.23E-6,
                    "low": 6.2E-6,
                    "close": 6.22E-6,
                    "volume": 45455,
                    "quoteAssetVolume": 0.18154949,
                    "baseAssetVolume": 29192,
                    "trades": 22,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030946"
                },
                {
                    "id": 163347,
                    "openTime": 1522748820000,
                    "closeTime": 1522748879999,
                    "open": 6.21E-6,
                    "high": 6.23E-6,
                    "low": 6.2E-6,
                    "close": 6.2E-6,
                    "volume": 21280,
                    "quoteAssetVolume": 0.08781687,
                    "baseAssetVolume": 14105,
                    "trades": 11,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030947"
                },
                {
                    "id": 163363,
                    "openTime": 1522748880000,
                    "closeTime": 1522748939999,
                    "open": 6.22E-6,
                    "high": 6.22E-6,
                    "low": 6.22E-6,
                    "close": 6.22E-6,
                    "volume": 7522,
                    "quoteAssetVolume": 0.00237604,
                    "baseAssetVolume": 382,
                    "trades": 3,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030948"
                },
                {
                    "id": 163379,
                    "openTime": 1522748940000,
                    "closeTime": 1522748999999,
                    "open": 6.22E-6,
                    "high": 6.22E-6,
                    "low": 6.22E-6,
                    "close": 6.22E-6,
                    "volume": 11412,
                    "quoteAssetVolume": 0,
                    "baseAssetVolume": 0,
                    "trades": 3,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030949"
                },
                {
                    "id": 163395,
                    "openTime": 1522749000000,
                    "closeTime": 1522749059999,
                    "open": 6.22E-6,
                    "high": 6.22E-6,
                    "low": 6.22E-6,
                    "close": 6.22E-6,
                    "volume": 1678,
                    "quoteAssetVolume": 0,
                    "baseAssetVolume": 0,
                    "trades": 1,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030950"
                },
                {
                    "id": 163411,
                    "openTime": 1522749060000,
                    "closeTime": 1522749119999,
                    "open": 6.23E-6,
                    "high": 6.23E-6,
                    "low": 6.23E-6,
                    "close": 6.23E-6,
                    "volume": 27326,
                    "quoteAssetVolume": 0.12716053,
                    "baseAssetVolume": 20411,
                    "trades": 10,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030951"
                },
                {
                    "id": 163427,
                    "openTime": 1522749120000,
                    "closeTime": 1522749179999,
                    "open": 6.23E-6,
                    "high": 6.23E-6,
                    "low": 6.22E-6,
                    "close": 6.22E-6,
                    "volume": 68968,
                    "quoteAssetVolume": 0.15026137,
                    "baseAssetVolume": 24119,
                    "trades": 12,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030952"
                },
                {
                    "id": 163443,
                    "openTime": 1522749180000,
                    "closeTime": 1522749239999,
                    "open": 6.22E-6,
                    "high": 6.23E-6,
                    "low": 6.22E-6,
                    "close": 6.22E-6,
                    "volume": 11924,
                    "quoteAssetVolume": 0.04742276,
                    "baseAssetVolume": 7612,
                    "trades": 6,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030953"
                },
                {
                    "id": 163459,
                    "openTime": 1522749240000,
                    "closeTime": 1522749299999,
                    "open": 6.23E-6,
                    "high": 6.25E-6,
                    "low": 6.23E-6,
                    "close": 6.23E-6,
                    "volume": 87998,
                    "quoteAssetVolume": 0.2454487,
                    "baseAssetVolume": 39339,
                    "trades": 23,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030954"
                },
                {
                    "id": 163475,
                    "openTime": 1522749300000,
                    "closeTime": 1522749359999,
                    "open": 6.24E-6,
                    "high": 6.24E-6,
                    "low": 6.23E-6,
                    "close": 6.24E-6,
                    "volume": 1942,
                    "quoteAssetVolume": 0.00326352,
                    "baseAssetVolume": 523,
                    "trades": 3,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030955"
                },
                {
                    "id": 163491,
                    "openTime": 1522749360000,
                    "closeTime": 1522749419999,
                    "open": 6.24E-6,
                    "high": 6.24E-6,
                    "low": 6.23E-6,
                    "close": 6.23E-6,
                    "volume": 6075,
                    "quoteAssetVolume": 0.03789585,
                    "baseAssetVolume": 6075,
                    "trades": 3,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030956"
                },
                {
                    "id": 163507,
                    "openTime": 1522749420000,
                    "closeTime": 1522749479999,
                    "open": 6.24E-6,
                    "high": 6.24E-6,
                    "low": 6.22E-6,
                    "close": 6.23E-6,
                    "volume": 1538779,
                    "quoteAssetVolume": 0.20779859,
                    "baseAssetVolume": 33356,
                    "trades": 19,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030957"
                },
                {
                    "id": 163523,
                    "openTime": 1522749480000,
                    "closeTime": 1522749539999,
                    "open": 6.21E-6,
                    "high": 6.22E-6,
                    "low": 6.2E-6,
                    "close": 6.22E-6,
                    "volume": 927867,
                    "quoteAssetVolume": 0.04530648,
                    "baseAssetVolume": 7284,
                    "trades": 19,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030958"
                },
                {
                    "id": 163539,
                    "openTime": 1522749540000,
                    "closeTime": 1522749599999,
                    "open": 6.21E-6,
                    "high": 6.22E-6,
                    "low": 6.21E-6,
                    "close": 6.21E-6,
                    "volume": 3406,
                    "quoteAssetVolume": 0.01495363,
                    "baseAssetVolume": 2406,
                    "trades": 4,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804030959"
                },
                {
                    "id": 163555,
                    "openTime": 1522749600000,
                    "closeTime": 1522749659999,
                    "open": 6.21E-6,
                    "high": 6.22E-6,
                    "low": 6.21E-6,
                    "close": 6.21E-6,
                    "volume": 139175,
                    "quoteAssetVolume": 0.00212724,
                    "baseAssetVolume": 342,
                    "trades": 4,
                    "symbol": "ZILBTC",
                    "timeFormat": "201804031000"
                }
            ];
            let params = {
                buy: {value: 5}
            };
            let result = Trader.haveToBuy(trades, candles, params);
            expect(result).to.equal(false);
        });

    });

});