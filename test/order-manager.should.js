const assert = require('chai').assert;
const expect = require('chai').expect;

const OrderManager = require('../components/modules/order-manager');

const bb = require('../binance-bot');
const orderManager = bb.components.orderManager;

describe('OrderManager', () => {

    describe('createOrder', () => {

        it('should create order', async () => {
            let options = {
                symbol: 'NCASHBTC',
                side: 'BUY',
                quantity: 100000,
                price: 0.00000001,
            };
            await orderManager.createOrder(options);
        });

    });

});