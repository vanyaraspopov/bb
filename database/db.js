'use strict';
var Sequelize = require('sequelize'),
    config = require('../config/config');
let sequelize = null;
module.exports = () => {
    if (!sequelize) {
        sequelize = new Sequelize(
            config.get('db').name,
            config.get('db').username,
            config.get('db').password,
            {
                dialect: config.get('db').dialect,
                storage: config.get('db').storage
            }
        );
    }
    return sequelize;
};