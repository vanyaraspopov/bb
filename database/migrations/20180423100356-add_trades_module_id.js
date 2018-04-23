'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addColumn('trades', 'module_id', {
                allowNull: false,
                default: 0,
                type: Sequelize.INTEGER
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeColumn('trades', 'module_id');
    }
};
