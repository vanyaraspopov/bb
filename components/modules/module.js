const db = require('../../database/db');

//  Models
const ModuleParameters = db.sequelize.models['ModuleParameters'];

class BBModule {
    constructor(bb) {
        this.bb = bb;
        this._params = undefined;
    }

    /**
     * Async getter. Returns only active parameters defined for module.
     * @returns {Promise<*>}
     */
    get activeParams() {
        return (async () => {
            let params = await this.params;
            return params.filter(p => p.active);
        })();
    }

    /**
     * Async getter. Returns parameters defined for module.
     * @returns {Promise<*>}
     */
    get params() {
        return (async () => {
            if (this._params !== undefined) {
                return this._params;
            }

            this._params = ModuleParameters
                .findAll({
                    where: {
                        module_id: this.module.id
                    },
                    include: ['symbol']
                })
                .catch(err => this.bb.log.error(err));

            return this._params;
        })();
    }

    /**
     * Defines module model
     * @returns {{id: number}}
     */
    get module() {
        return {
            id: 0,
            title: 'Test module',
            pm2_name: 'bb.test'
        };
    }

    /**
     * Defines array of tasks that module have to do
     * @returns {*[]}
     */
    get tasks() {
        return [
            {
                action: (interval) => {
                    console.log(`I'm running every ${interval} microseconds`);
                },
                interval: 2 * 1000,     //  microseconds, if not set or zero - do once
                delay: 0,               //  microseconds, if zero - start immediately
                title: 'Test task'      //  title for debugging
            }
        ];
    }

    /**
     * Run tasks defined in "tasks" method
     */
    run() {
        let context = this;
        let tasks = this.tasks;
        for (let task of tasks) {
            let interval = Number(task.interval || 0);
            let delay = Number(task.delay || 0);
            let action = () => task.action.call(context, interval);
            if (interval > 0) {
                setInterval(action, interval);
            }
            setTimeout(action, delay);
        }
    }
}

module.exports = BBModule;