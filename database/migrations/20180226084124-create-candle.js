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
        type: Sequelize.DECIMAL(32,8)
      },
      high: {
        allowNull: false,
        type: Sequelize.DECIMAL(32,8)
      },
      low: {
        allowNull: false,
        type: Sequelize.DECIMAL(32,8)
      },
      close: {
        allowNull: false,
        type: Sequelize.DECIMAL(32,8)
      },
      volume: {
        allowNull: false,
        type: Sequelize.DECIMAL(32,8)
      },
      quoteAssetVolume: {
        allowNull: false,
        type: Sequelize.DECIMAL(32,8)
      },
      baseAssetVolume: {
        allowNull: false,
        type: Sequelize.DECIMAL(32,8)
      },
      trades: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      symbol: {
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('candles');
  }
};