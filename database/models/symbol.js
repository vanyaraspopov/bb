'use strict';
module.exports = (sequelize, DataTypes) => {
    let Symb = sequelize.define('Symb', {
        quot: DataTypes.STRING,
        base: DataTypes.STRING
    }, {
        tableName: 'symbols',
        getterMethods: {
            symbol() {
                return this.base + this.quot;
            }
        }
    });

    Symb.associate = function (models) {
        models.Symb.hasMany(models.ModuleParameters, {
            foreignKey: 'symbol_id',
            as: 'params',
            onDelete: 'cascade',
            hooks: true
        });
        models.Symb.hasMany(models.Order, {
            foreignKey: 'symbol_id',
            as: 'orders',
            hooks: true
        });
    };

    return Symb;
};