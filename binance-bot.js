'use strict';

const http = require('http');

var server = http.createServer(function (req, res) {
    res.end('Hello, World!');
});
server.listen(3000, '127.0.0.1');
