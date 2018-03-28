'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addColumn('orders', 'success', {
                allowNull: true,
                defaultValue: null,
                type: Sequelize.BOOLEAN
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeColumn('orders', 'success');
    }
};
