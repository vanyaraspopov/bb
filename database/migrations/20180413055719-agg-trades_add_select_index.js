'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addIndex('agg_trades', {
                fields: [
                    'symbol',
                    'timeStart'
                ],
                name: 'agg_trades_fast_select',
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeIndex('agg_trades', 'agg_trades_fast_select');
    }
};
