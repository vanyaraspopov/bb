'use strict';
module.exports = (sequelize, DataTypes) => {
    let Module = sequelize.define('Module', {
        title: DataTypes.STRING,
        pm2_name: DataTypes.STRING
    }, {
        tableName: 'modules',
    });
    Module.associate = function (models) {
        models.Module.hasMany(models.ModuleParameters, {
            foreignKey: 'module_id',
            as: 'params',
            onDelete: 'cascade',
            hooks: true
        });
    };

    return Module;
};