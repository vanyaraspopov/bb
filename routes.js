const config = require('./config/config.json');
const pm2 = require('pm2');

module.exports = (app) => {

    const API_URI = '/api';

    app.get(API_URI + "/modules", (request, response) => {
        connectToPm2ThenDo(
            () => {
                pm2.list((err, processList) => {
                    if (err) {
                        response.send(err);
                    }
                    let processes = {};
                    let modules = config['pm2']['modules'];
                    for (let moduleName in modules) {
                        if (modules.hasOwnProperty(moduleName)) {
                            processes[moduleName] = {
                                title: modules[moduleName],
                                status: null
                            };
                        }
                    }
                    for (let p of processList) {
                        if (processes.hasOwnProperty(p.name)) {
                            processes[p.name].status = p.pm2_env.status;
                        }

                    }
                    response.send(processes);
                });
            },
            err => response.send(err)
        );
    });

    app.get(API_URI + "/modules/start/:name", (request, response) => {
        connectToPm2ThenDo(
            () => {
                let script = `./${request.params.name}.js`;
                pm2.start(
                    script,
                    (err, apps) => {
                        pm2.disconnect();
                        if (err) response.send(err);
                        else response.send(apps);
                    })
            },
            err => response.send(err)
        );
    });

    app.get(API_URI + "/modules/stop/:name", (request, response) => {
        connectToPm2ThenDo(
            () => {
                let script = request.params.name;
                pm2.stop(
                    script,
                    (err, proc) => {
                        pm2.disconnect();
                        if (err) response.send(err);
                        else response.send(proc);
                    })
            },
            err => response.send(err)
        );
    });

    app.get(API_URI + '/currencies', (request, response) => {
        response.send([
            {
                symbol: 'ETHBTC',
                quot: 'ETH',
                base: 'BTC',
                sum: 0.001,
                buy: 5,
                sellHigh: '2%',
                sellLow: '10%',
                modules: {
                    'bb.trader': true,
                    'bb.data-collector': true
                }
            },
            {
                symbol: 'LTCBTC',
                quot: 'LTC',
                base: 'BTC',
                sum: 0.001,
                buy: 5,
                sellHigh: '',
                sellLow: '',
                modules: {
                    'bb.trader': false,
                    'bb.data-collector': true
                }
            }
        ]);
    });

};

function connectToPm2ThenDo(action, errback) {
    pm2.connect(err => {
        if (err) {
            errback(err);
        } else {
            action();
        }
    });
}