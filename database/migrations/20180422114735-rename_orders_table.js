'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.renameTable('orders', 'trades');
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.renameTable('trades', 'orders');
    }
};
