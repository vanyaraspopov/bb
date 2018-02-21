'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var modelsDir = __dirname + '/models';
var config    = require('../config/config.json')['db'];
var db        = {};

var sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
    .readdirSync(modelsDir)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        var model = sequelize['import'](path.join(modelsDir, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;