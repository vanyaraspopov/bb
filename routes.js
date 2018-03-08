const config = require('./config/config.json');
const pm2 = require('pm2');

module.exports =  (app) => {

    const API_URI = '/api';

    app.get(API_URI + "/modules", (request, response)=> {
        pm2.connect(err => {
            if (err) {
                response.send(err);
            } else {
                pm2.list((err, processList) => {
                    if (err) {
                        response.send(err);
                    }
                    let processes = {};
                    let modules = config['pm2']['modules'];
                    for (let moduleName of modules) {
                        processes[moduleName] = {
                            status: null
                        };
                    }
                    for (let p of processList) {
                        if (processes.hasOwnProperty(p.name)) {
                            processes[p.name].status = p.pm2_env.status;
                        }

                    }
                    response.send(processes);
                });
            }
        });
    });

    app.get(API_URI + '/test', (request, response) => {
        response.send('test');
    });

};