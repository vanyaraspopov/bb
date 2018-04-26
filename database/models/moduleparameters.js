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

    /**
     * Activates module parameters
     * @returns {Promise<ModuleParameters>}
     */
    ModuleParameters.prototype.activate = function () {
        return this.update({active: true})
            .catch(err => this.bb.log.error(err));
    };

    /**
     * Deactivates module parameters
     * @returns {Promise<ModuleParameters>}
     */
    ModuleParameters.prototype.deactivate = function () {
        return this.update({active: false})
            .catch(err => this.bb.log.error(err));
    };

    let paramsToString = function (mp) {
        if (typeof(mp.params) === 'object') {
            mp.params = JSON.stringify(mp.params);
        }
    };
    ModuleParameters.hook('beforeValidate', paramsToString);

    return ModuleParameters;
};