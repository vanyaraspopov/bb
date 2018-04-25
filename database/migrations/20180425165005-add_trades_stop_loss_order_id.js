'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('trades', 'stop_loss_order_id', {
            allowNull: true,
            type: Sequelize.INTEGER
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('trades', 'stop_loss_order_id');
    }
};