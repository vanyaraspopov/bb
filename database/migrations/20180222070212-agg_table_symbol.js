'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('agg_trades', 'symbol', {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.STRING
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('agg_trades', 'symbol');
  }
};
