class BBModule {
    constructor (bb) {
        this.bb = bb;
    }

    /**
     * Run tasks defined in "tasks" method
     */
    run () {
        let context = this;
        let tasks = this.tasks();
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

    /**
     * Defines array of tasks that module have to do
     * @returns {*[]}
     */
    tasks() {
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
}

module.exports = BBModule;