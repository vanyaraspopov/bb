const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/config.json')['server'];
const express = require('express');
const routes = require('./routes');
const session = require('express-session');

let app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'HAKUNA_MATATA'
}));

routes(app);
app.use(express.static('frontend'));
app.listen(config.port, config.host);
console.info(`Server started at ${config.host} and listening port ${config.port}`);