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
      price: {
        type: Sequelize.DECIMAL(32,8)
      },
      quantity: {
        type: Sequelize.DECIMAL(32,8)
      },
      closed: {
        type: Sequelize.BOOLEAN
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('orders');
  }
};