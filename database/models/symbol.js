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
        if (typeof(this.filters) === 'string') {
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

    /**
     * Check if price matches requirements
     * @param {string} price
     * @returns {boolean}
     */
    Symb.prototype.checkPrice = function (price) {
        price = Number(price);
        let filter = this.getFilter('PRICE_FILTER');
        let min = Number(filter['minPrice']);
        let max = Number(filter['maxPrice']);
        let step = Number(filter['tickSize']);
        let isCorrect = true;
        isCorrect &= (price >= min);
        isCorrect &= (price <= max);

        let remainder = price % step;
        remainder = Number(remainder.toFixed(8));
        isCorrect &= (remainder === 0);

        return Boolean(isCorrect);
    };

    /**
     * Check if quantity matches requirements
     * @param {string} quantity
     * @returns {boolean}
     */
    Symb.prototype.checkLotSize = function (quantity) {
        quantity = Number(quantity);
        let filter = this.getFilter('LOT_SIZE');
        let min = Number(filter['minQty']);
        let max = Number(filter['maxQty']);
        let step = Number(filter['stepSize']);
        let isCorrect = true;
        isCorrect &= (quantity >= min);
        isCorrect &= (quantity <= max);

        let remainder = quantity % step;
        remainder = Number(remainder.toFixed(8));
        isCorrect &= (remainder === 0);

        return Boolean(isCorrect);
    };

    /**
     * Check if minimal notional matches requirements
     * @param {string} price
     * @param {string} quantity
     * @returns {boolean}
     */
    Symb.prototype.checkMinNotional = function (price, quantity) {
        price = Number(price);
        quantity = Number(quantity);
        let filter = this.getFilter('MIN_NOTIONAL');
        let notional = price * quantity;
        let min = Number(filter['minNotional']);
        return notional >= min;
    };

    /**
     * Check if price and quantity pass symbol filters
     * @param {string} price
     * @param {string} quantity
     */
    Symb.prototype.checkFilters = function (price, quantity) {
        let isCorrect = true;
        isCorrect &= this.checkPrice(price);
        isCorrect &= this.checkLotSize(quantity);
        isCorrect &= this.checkMinNotional(price, quantity);
        return Boolean(isCorrect);
    };

    /**
     * Price precision correction
     * @param {string} price
     * @returns {string}
     */
    Symb.prototype.correctPrice = function (price) {
        let _price = Number(price);
        let filter = this.getFilter('PRICE_FILTER');
        let step = Number(filter['tickSize']);
        let remainder = _price % step;
        if (Number(remainder.toFixed(8)) > 0) {
            _price -= remainder;
        }
        return _price.toFixed(8);
    };

    /**
     * Quantity precision correction
     * @param {string} quantity
     * @returns {string}
     */
    Symb.prototype.correctQuantity = function (quantity) {
        let _quantity = Number(quantity);
        let filter = this.getFilter('LOT_SIZE');
        let step = Number(filter['stepSize']);
        let remainder = _quantity % step;
        if (Number(remainder.toFixed(8)) > 0) {
            _quantity -= remainder;
        }
        return _quantity.toFixed(8);
    };

    Symb.hook('afterFind', Symb.paramsToArray);

    return Symb;
};