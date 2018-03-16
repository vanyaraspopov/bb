'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addColumn('orders', 'symbol', {
                allowNull: false,
                defaultValue: '',
                type: Sequelize.STRING
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeColumn('orders', 'symbol');
    }
};
