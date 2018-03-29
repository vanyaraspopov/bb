'use strict';
module.exports = (sequelize, DataTypes) => {
    let Module = sequelize.define('Module', {
        title: DataTypes.STRING,
        pm2_name: DataTypes.STRING
    }, {
        tableName: 'modules',
    });
    Module.associate = function (models) {
        // associations can be defined here
    };
    return Module;
};