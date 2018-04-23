const pm2 = require('pm2');

module.exports = (app) => {

    const bb = app.bb;
    const config = bb.config;
    const db = bb.components.db;

    //  Models
    const Currency = db.sequelize.models['Currency'];
    const Module = db.sequelize.models['Module'];
    const ModuleParameters = db.sequelize.models['ModuleParameters'];
    const Symb = db.sequelize.models['Symb'];
    const User = db.sequelize.models['User'];

    const API_URI = '/api';

    /**
     * Modules
     */
    app.get(API_URI + "/modules", loadUser, (request, response) => {
        return (async() => {
            let modules = bb.modules;
            let processes = {};
            for (let key in modules) {
                if (modules.hasOwnProperty(key)) {
                    processes[key] = modules[key].module;
                    processes[key].params = await modules[key].params;
                    processes[key].status = modules[key].isActive ? 'online' : 'stopped';
                }
            }
            response.send(processes);
        })();
    });

    app.get(API_URI + "/modules/start/:name", loadUser, (request, response) => {
        let key = request.params.name;
        bb.modules[key].run();
        response.send(bb.modules[key].isActive);
    });

    app.get(API_URI + "/modules/stop/:name", loadUser, (request, response) => {
        let key = request.params.name;
        bb.modules[key].stop();
        response.send(!bb.modules[key].isActive);
    });

    app.get(API_URI + "/modules/params/:module_id", loadUser, (request, response) => {
        let module_id = request.params.module_id;
        ModuleParameters
            .findAll({where: module_id})
            .then(mp => response.send(mp))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    app.post(API_URI + '/modules/params', loadUser, (request, response) => {
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

    app.put(API_URI + '/modules/params/:id', loadUser, (request, response) => {
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

    app.delete(API_URI + '/modules/params/:id', loadUser, (request, response) => {
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

    //  Delete all parameters of module with :id
    app.delete(API_URI + '/modules/:id/params', loadUser, (request, response) => {
        let id = request.params.id;
        ModuleParameters
            .destroy({
                where: {
                    module_id: id
                }
            })
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

    app.post(API_URI + '/symbols', loadUser, (request, response) => {
        let values = request.body;
        Symb.create(values)
            .then(symbol => response.send(symbol))
            .catch(err => {
                bb.log.error(err);
                response.send(err)
            });
    });

    app.delete(API_URI + '/symbols/:id', loadUser, (request, response) => {
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