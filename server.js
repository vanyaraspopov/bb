const config = require('./config/config.json')['server'];
const express = require("express");
const pm2 = require('pm2');

var app = express();

app.get("/modules", (request, response)=> {
    pm2.connect(err => {
        if (err) {
            response.send(err);
        } else {
            pm2.list((err, processList) => {
                if (err) {
                    response.send(err);
                }

                let processes = [];
                for (let p of processList) {
                    processes.push({
                        name: p.name,
                        status: p.pm2_env.status
                    });
                }
                response.send(processes);
            });
        }
    });
});

app.use(express.static('frontend'));
app.listen(config.port, config.host);