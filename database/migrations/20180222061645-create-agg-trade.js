'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('agg_trades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      timeStart: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      timeEnd: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      quantity: {
        allowNull: false,
        type: Sequelize.DECIMAL
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('agg_trades');
  }
};