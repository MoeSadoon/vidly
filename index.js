const express = require('express');
const morgan = require('morgan');
const app = express();
const winston = require('winston');
const port = process.env.PORT || 3000;

require('./startup/logging')(); // Note how this is loaded first
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
};

app.listen(port, () => winston.info(`Listening on port ${port}...`));