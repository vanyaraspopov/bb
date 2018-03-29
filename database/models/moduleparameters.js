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
        models.ModuleParameters.belongsTo(models.Module, {
            foreignKey: 'module_id',
            as: 'module'
        });
        models.ModuleParameters.belongsTo(models.Symb, {
            foreignKey: 'symbol_id',
            as: 'symbol'
        });
    };
    return ModuleParameters;
};