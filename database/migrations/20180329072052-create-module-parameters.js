'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('module_parameters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            module_id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            symbol_id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            params: {
                allowNull: false,
                type: Sequelize.TEXT,
                defaultValue: '{}'
            },
            active: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('module_parameters');
    }
};