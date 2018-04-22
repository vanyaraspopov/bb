'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            trade_id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            symbol_id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            side: {
                allowNull: false,
                type: Sequelize.STRING
            },
            type: {
                allowNull: false,
                type: Sequelize.STRING
            },
            status: {
                allowNull: false,
                type: Sequelize.STRING
            },
            origQty: {
                allowNull: false,
                type: Sequelize.DECIMAL(32, 8)
            },
            executedQty: {
                allowNull: false,
                type: Sequelize.DECIMAL(32, 8)
            },
            price: {
                allowNull: false,
                type: Sequelize.DECIMAL(32, 8)
            },
            time: {
                allowNull: false,
                type: Sequelize.BIGINT
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('orders');
    }
};
