'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addColumn('orders', 'closed', {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.BOOLEAN
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeColumn('orders', 'closed');
    }
};
