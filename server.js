const bodyParser = require('body-parser');
const config = require('./config/config.json')['server'];
const express = require('express');
const routes = require('./routes');

var app = express();
app.use(bodyParser());
routes(app);
app.use(express.static('frontend'));
app.listen(config.port, config.host);
console.info(`Server started at ${config.host} and listening port ${config.port}`);