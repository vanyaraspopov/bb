const db = require('../../database/db');

//  Models
const ModuleParameters = db.sequelize.models['ModuleParameters'];

class BBModule {
    constructor(bb) {
        this.bb = bb;
        this._taskIntervals = {};
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
     * True if module has running tasks
     * @returns {boolean}
     */
    get isActive() {
        return Object.keys(this._taskIntervals).length !== 0;
    }

    /**
     * Async getter. Returns parameters defined for module.
     * @returns {Promise<*>}
     */
    get params() {
        return (async () => {
            return ModuleParameters
                .findAll({
                    where: {
                        module_id: this.module.id
                    },
                    include: ['symbol']
                })
                .catch(err => this.bb.log.error(err));
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
                key: 'example',         //  Key used for identification in the task list
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
        for (let task of this.tasks) {
            this.runTask(task);
        }
    }

    /**
     * Run separate task
     * @param task
     */
    runTask(task) {
        let context = this;
        if (this._taskIntervals.hasOwnProperty(task.key)) {
            return;
        }
        let interval = Number(task.interval || 0);
        let delay = Number(task.delay || 0);
        let action = () => task.action.call(context, interval);
        if (interval > 0) {
            setTimeout(() => {
                this._taskIntervals[task.key] = setInterval(action, interval);
            }, delay);
        }
        setTimeout(action, delay);
    }

    /**
     * Stop all tasks
     */
    stop() {
        for (let key in this._taskIntervals) {
            this.stopTask(key);
        }
    }

    /**
     * Stop separate task by key
     * @param key
     */
    stopTask(key) {
        if (this._taskIntervals.hasOwnProperty(key)) {
            clearInterval(this._taskIntervals[key]);
            delete this._taskIntervals[key];
        }
    }
}

module.exports = BBModule;