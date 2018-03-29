'use strict';
module.exports = (sequelize, DataTypes) => {
    let ModuleParameters = sequelize.define('ModuleParameters', {
        module_id: DataTypes.INTEGER,
        symbol_id: DataTypes.INTEGER,
        params: DataTypes.TEXT,
        active: DataTypes.BOOLEAN
    }, {
        tableName: 'module_parameters',
    });
    ModuleParameters.associate = function (models) {
        // associations can be defined here
    };
    return ModuleParameters;
};