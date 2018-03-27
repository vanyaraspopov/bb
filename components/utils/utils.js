const moment = require('moment');

module.exports = {

    /**
     * Returns an object represented the map. integer(timestamp) key => any value
     * @param count of last minutes
     * @param end Right border of last minutes (exclusive)
     * @param defaultValue
     * @returns {Object}
     */
    lastMinutesMap(count, end, defaultValue) {
        end = moment(end) || moment().startOf('minute').utc();
        let start = moment(end).subtract(count, 'minutes');
        let map = {};

        let current = moment(start);
        while (current.unix() < end.unix()) {
            let ts = current.unix() * 1000;
            map[ts] = current.format('YYYYMMDDHHmm');
            if (defaultValue !== undefined) {
                map[ts] = defaultValue;
            }
            current.add(1, 'minutes');
        }

        return map;
    },

    /**
     * Helper method to define start and end timestamps of minutes map.
     * @param map
     * @returns {{start: number, end: number}}
     */
    lastMinutesMapBorders(map) {
        let minutes = Object.keys(map).map(v => Number(v));
        return {
            start: minutes[0],
            end: minutes[minutes.length - 1] + 999
        };
    }

};