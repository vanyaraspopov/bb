'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('candles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      openTime: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      closeTime: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      open: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      high: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      low: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      close: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      volume: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      quoteAssetVolume: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      baseAssetVolume: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      trades: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('candles');
  }
};