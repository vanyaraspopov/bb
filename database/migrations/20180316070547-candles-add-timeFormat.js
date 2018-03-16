'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addColumn('candles', 'timeFormat', {
                allowNull: true,
                type: Sequelize.STRING
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeColumn('candles', 'timeFormat');
    }
};
