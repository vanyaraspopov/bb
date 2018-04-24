'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addColumn('symbols', 'orderTypes', {
                allowNull: false,
                type: Sequelize.TEXT,
                defaultValue: '[]'
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeColumn('symbols', 'orderTypes');
    }
};
