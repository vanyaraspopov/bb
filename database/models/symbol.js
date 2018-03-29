'use strict';
module.exports = (sequelize, DataTypes) => {
    let Symb = sequelize.define('Symb', {
        quot: DataTypes.STRING,
        base: DataTypes.STRING
    }, {
        tableName: 'symbols',
        getterMethods: {
            symbol() {
                return this.quot + this.base;
            }
        }
    });

    Symb.associate = function (models) {
        models.Symb.hasMany(models.ModuleParameters, {
            foreignKey: 'symbol_id',
            as: 'params'
        });
    };

    return Symb;
};