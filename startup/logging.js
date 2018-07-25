// require('express-async-errors'); // we dont have to assign it to a constant
const winston = require('winston');
require('winston-mongodb');

module.exports = function() {
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
    
    winston.exceptions.handle(
        new winston.transports.File({ filename: "uncaughtExceptions.log" } ),
        new winston.transports.Console({ colorize: true, prettyPrint: true })
    );
    
    winston.add(new winston.transports.File({
        filename: "logfile.log",
    }));
    
    winston.add(new winston.transports.MongoDB({
        db: 'mongodb://localhost/vidly',
        level: 'error', //only error messages will be logged
    }));
    
};