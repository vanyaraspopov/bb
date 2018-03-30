const Trader = require('./trader');

class Scalper extends Trader {
    constructor(bb) {
        super(bb);
    }

    /**
     * @inheritDoc
     */
    get module() {
        return {
            id: 3,
            title: 'Скальпер',
            pm2_name: 'bb.scalper'
        };
    }

    /**
     * @inheritDoc
     */
    get tasks() {
        return[];
    }
}

module.exports = Scalper;