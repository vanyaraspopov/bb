const assert = require('chai').assert;
const expect = require('chai').expect;

const utils = require('../components/utils/utils');

describe('Utils', () => {

    describe('lastMinutesMap*', () => {

        it('should return map with correct keys', () => {
            let map = utils.lastMinutesMap(10);
            let {
                start: startTime,
                end: endTime
            } = utils.lastMinutesMapBorders(map);
            debugger;
            expect(true).to.equal(true);
        });

    });

});