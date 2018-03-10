'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('currencies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            quot: {
                type: Sequelize.STRING
            },
            base: {
                type: Sequelize.STRING
            },
            sum: {
                type: Sequelize.DECIMAL
            },
            params: {
                type: Sequelize.STRING
            },
            active: {
                type: Sequelize.BOOLEAN
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('currencies');
    }
};