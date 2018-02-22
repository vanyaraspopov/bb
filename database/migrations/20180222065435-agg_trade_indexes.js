'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addIndex('agg_trades', {
                fields: [
                    'timeStart',
                    'timeEnd'
                ],
                name: 'agg_trades_unique',
                unique: true
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeIndex('agg_trades', 'agg_trades_unique');
    }
};
