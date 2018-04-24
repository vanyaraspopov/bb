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

    /**
     * Convert properties defined as JSON strings to objects
     * @param {Array<Symb>|Symb} symbols
     */
    Symb.paramsToArray = function (symbols) {
        let _symbols = [];
        if (!(symbols instanceof Array)) {
            _symbols.push(symbols)
        } else {
            _symbols = symbols;
        }
        for (let symbol of _symbols) {
            symbol.orderTypes = JSON.parse(symbol.orderTypes);
            symbol.filters = JSON.parse(symbol.filters);
        }
    };

    /**
     *
     * @param key
     * @returns {*}
     */
    Symb.prototype.getFilter = function (key) {
        if (this.filters instanceof String) {
            Symb.paramsToArray(this);
        }
        for (let filter of this.filters) {
            if (filter['filterType'] === key) {
                return filter;
            }
        }
    };

    /**
     * Check if order type accessible for this symbol
     * @param orderType
     * @returns {boolean}
     */
    Symb.prototype.checkOrderType = function (orderType) {
        if (this.orderTypes instanceof String) {
            Symb.paramsToArray(this);
        }
        return this.orderTypes.includes(orderType);
    };

    Symb.prototype.checkPrice = function (price) {
        let filter = this.getFilter('PRICE_FILTER');
        let min = Number(filter['minPrice']);
        let max = Number(filter['maxPrice']);
        let step = Number(filter['tickSize']);
        let isCorrect = true;
        isCorrect &= (price >= min);
        isCorrect &= (price <= max);
        isCorrect &= (price % step === 0);
        return isCorrect;
    };
    Symb.prototype.checkLotSize = function (quantity) {
        let filter = this.getFilter('LOT_SIZE');
        let min = Number(filter['minQty']);
        let max = Number(filter['maxQty']);
        let step = Number(filter['stepSize']);
        let isCorrect = true;
        isCorrect &= (quantity >= min);
        isCorrect &= (quantity <= max);
        isCorrect &= (quantity % step === 0);
        return isCorrect;
    };
    Symb.prototype.checkMinNotional = function (price, quantity) {
        let filter = this.getFilter('MIN_NOTIONAL');
        let notional = price * quantity;
        let min = Number(filter['minNotional']);
        return notional >= min;
    };

    /**
     * Check if price and quantity pass symbol filters
     * @param price
     * @param quantity
     */
    Symb.prototype.checkFilters = function (price, quantity) {
        this.checkPrice(price);
        this.checkLotSize(quantity);
        this.checkMinNotional(price, quantity);
    };

    Symb.hook('afterFind', Symb.paramsToArray);

    return Symb;
};