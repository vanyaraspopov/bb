'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addColumn('orders', 'mark', {
                allowNull: true,
                type: Sequelize.STRING
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeColumn('orders', 'mark');
    }
};
