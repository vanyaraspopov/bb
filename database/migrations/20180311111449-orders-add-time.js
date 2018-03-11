'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addColumn('orders', 'time', {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.BIGINT
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeColumn('orders', 'time');
    }
};
