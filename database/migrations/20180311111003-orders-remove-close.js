'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('orders', 'closed');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'closed', {
      type: Sequelize.BOOLEAN
    });
  }
};
