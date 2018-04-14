'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addIndex('candles', {
                fields: [
                    'symbol',
                    'openTime',
                    'closeTime'
                ],
                name: 'candles_fast_select',
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeIndex('candles', 'candles_fast_select');
    }
};
