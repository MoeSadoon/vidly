const winston = require('winston');

module.exports = function(err, req, res, next) {
    winston.error(err.message, err); // 2nd argument is additional metadata we wish to log
    res.status(500).send('Something went wrong');
}