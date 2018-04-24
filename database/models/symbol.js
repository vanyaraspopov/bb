'use strict';
module.exports = (sequelize, DataTypes) => {
    let Symb = sequelize.define('Symb', {
        quot: DataTypes.STRING,
        base: DataTypes.STRING,
        orderTypes: DataTypes.JSON,
        filters: DataTypes.JSON,
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

    let paramsToArray = function (results) {
        let symbols = [];
        if (!(results instanceof Array)) {
            symbols.push(results)
        } else {
            symbols = results;
        }
        for (let symbol of symbols) {
            symbol.orderTypes = JSON.parse(symbol.orderTypes);
            symbol.filters = JSON.parse(symbol.filters);
        }
    };

    Symb.hook('afterFind', paramsToArray);

    return Symb;
};