'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addColumn('agg_trades', 'timeFormat', {
                allowNull: true,
                type: Sequelize.STRING
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeColumn('agg_trades', 'timeFormat');
    }
};
