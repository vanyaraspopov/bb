'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('trades', 'sell_by_time_limit', {
            allowNull: true,
            type: Sequelize.BOOLEAN
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('trades', 'sell_by_time_limit');
    }
};