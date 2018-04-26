const moment = require('moment');
const winston = require('winston');

const MOMENT_FORMAT_LOG = '';

const LOG_LEVEL_ERROR = 'error';
const LOG_LEVEL_INFO = 'info';

const logger = winston.createLogger({
    level: LOG_LEVEL_ERROR,
    format: winston.format.simple(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.Console(),
        new winston.transports.File({filename: 'error.log', level: LOG_LEVEL_ERROR})
    ]
});

function _timeLabel() {
    return `[${moment().format(MOMENT_FORMAT_LOG)}]`;
}

module.exports = {
    error: (obj) => {
        logger.error(`${_timeLabel()} ${obj.message}`, obj)
    },
    info: (obj) => {
        logger.info(`${_timeLabel()} ${obj.message}`, obj);
    },
    log: (level, obj) => {
        logger.log(level, `${_timeLabel()} ${obj.message}`, obj);
    }
};