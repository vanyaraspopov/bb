'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
        .addColumn('orders', 'stopLoss', {
          allowNull: true,
          type: Sequelize.DECIMAL
        });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
        .removeColumn('orders', 'stopLoss');
  }
};
