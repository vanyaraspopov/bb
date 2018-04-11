'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addColumn('orders', 'ratio', {
                allowNull: true,
                type: Sequelize.DECIMAL(32,8)
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeColumn('orders', 'ratio');
    }
};
