const bb = require('./binance-bot');
const config = bb.config;
const db = bb.components.db;
const pm2 = require('pm2');

//  Models
const Currency = db.sequelize.models['Currency'];

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
        Currency
            .findAll()
            .then(currencies => response.send(currencies))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    app.post(API_URI + '/currencies', (request, response) => {
        let values = request.body;
        Currency.create(values)
            .then(currency => response.send(currency))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    app.put(API_URI + '/currencies/:id', (request, response) => {
        let id = request.params.id;
        let values = request.body;
        Currency
            .findById(id)
            .then(currency => {
                currency = Object.assign(currency, values);
                return currency.save();
            })
            .then(() => response.send(true))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    app.delete(API_URI + '/currencies/:id', (request, response) => {
        let id = request.params.id;
        Currency
            .findById(id)
            .then(currency => currency.destroy())
            .then(() => response.send(true))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
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