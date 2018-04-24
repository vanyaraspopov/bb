const db = require('../db');

//  Models
const Symb = db.sequelize.models['Symb'];

const exchangeInfo = require('./exchange-info');
let allSymbols = exchangeInfo['symbols'];

let btcSymbols = [];
for (let symbol of allSymbols) {
    if (symbol['quoteAsset'] === 'BTC') {
        btcSymbols.push(symbol);
    }
}

for (let i = 0; i < btcSymbols.length; i++) {
    let symbol = btcSymbols[i];
    let {
        baseAsset: base,
        quoteAsset: quot,
        orderTypes,
        filters
    } = symbol;
    Symb.count({where: {base, quot}})
        .then(count => {
            if (count === 0) {
                return Symb.create({quot, base, orderTypes, filters});
            }
            if (count === 1) {
                return Symb.update({orderTypes, filters}, {where: {base, quot}});
            }
            return Promise.reject(`count: ${count}`);
        })
        .catch(err => console.error(err));
}