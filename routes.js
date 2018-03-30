const bb = require('./binance-bot');
const config = bb.config;
const db = bb.components.db;
const pm2 = require('pm2');

//  Models
const Currency = db.sequelize.models['Currency'];
const Module = db.sequelize.models['Module'];
const ModuleParameters = db.sequelize.models['ModuleParameters'];
const Symb = db.sequelize.models['Symb'];
const User = db.sequelize.models['User'];

module.exports = (app) => {

    const API_URI = '/api';

    /**
     * Modules
     */
    app.get(API_URI + "/modules", (request, response) => {
        connectToPm2ThenDo(
            () => {
                return Module
                    .findAll({
                        include: [
                            {
                                association: 'params',
                                include: ['symbol']
                            }
                        ]
                    })
                    .then(modules => {
                        pm2.list((err, processList) => {
                            if (err) {
                                response.send(err);
                            }
                            let processes = {};
                            for (let m of modules) {
                                processes[m.pm2_name] = m.dataValues;
                                processes[m.pm2_name].status = null;
                            }
                            for (let p of processList) {
                                if (processes.hasOwnProperty(p.name)) {
                                    processes[p.name].status = p.pm2_env.status;
                                }

                            }
                            pm2.disconnect();
                            response.send(processes);
                        });
                    })
                    .catch(err => response.send(err));
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

    app.get(API_URI + "/modules/params/:module_id", (request, response) => {
        let module_id = request.params.module_id;
        ModuleParameters
            .findAll({where: module_id})
            .then(mp => response.send(mp))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    app.post(API_URI + '/modules/params', (request, response) => {
        let values = request.body;
        ModuleParameters.create(values)
            .then(mp => ModuleParameters.findOne({
                where: { id: mp.id },
                include: ['symbol']
            }))
            .then(mp => response.send(mp))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    app.put(API_URI + '/modules/params/:id', (request, response) => {
        let id = request.params.id;
        let values = request.body;
        ModuleParameters
            .findById(id)
            .then(mp => {
                mp = Object.assign(mp, values);
                return mp.save();
            })
            .then(() => response.send(true))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    app.delete(API_URI + '/modules/params/:id', (request, response) => {
        let id = request.params.id;
        ModuleParameters
            .findById(id)
            .then(mp => mp.destroy())
            .then(() => response.send(true))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    /**
     * Symbols
     */
    app.get(API_URI + '/symbols', loadUser, (request, response) => {
        Symb
            .findAll()
            .then(symbols => response.send(symbols))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    app.post(API_URI + '/symbols', (request, response) => {
        let values = request.body;
        Symb.create(values)
            .then(symbol => response.send(symbol))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    app.delete(API_URI + '/symbols/:id', (request, response) => {
        let id = request.params.id;
        Symb
            .findById(id)
            .then(symbol => symbol.destroy())
            .then(() => response.send(true))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    /**
     * Static
     */
    app.get('/', loadUser, (request, response) => {
        response.redirect('/index.html');
    });

    app.get('/index.html', loadUser);

    app.post('/login.html', (request, response) => {
        let {username, password} = request.body;
        User.findOne({where: {username}})
            .then(user => {
                return new Promise((resolve, reject) => {
                    if (user.password === password) {
                        request.session.user = {
                            id: user.id,
                            username: user.username
                        };
                        response.redirect('/index.html');
                        resolve();
                    } else {
                        reject('invalid password');
                    }
                });
            })
            .catch(err => response.redirect('/login.html?success=0'));
    });

    app.get('/logout', (request, response) => {
        delete request.session.user;
        response.redirect('/login.html');
    })

};

function connectToPm2ThenDo(action, errback) {
    return pm2.connect(err => {
        if (err) {
            errback(err);
        } else {
            action();
        }
    });
}

function loadUser(request, response, next) {
    if (request.session.user) {
        next();
    } else {
        response.redirect('/login.html');
    }
}