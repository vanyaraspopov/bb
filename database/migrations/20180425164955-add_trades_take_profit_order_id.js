'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('trades', 'take_profit_order_id', {
            allowNull: true,
            type: Sequelize.INTEGER
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('trades', 'take_profit_order_id');
    }
};