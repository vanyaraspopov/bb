'use strict';
module.exports = (sequelize, DataTypes) => {
  var order = sequelize.define('order', {
    price: DataTypes.DECIMAL,
    quantity: DataTypes.DECIMAL,
    closed: DataTypes.BOOLEAN
  }, {});
  order.associate = function(models) {
    // associations can be defined here
  };
  return order;
};