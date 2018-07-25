// Here we setup the middleware routes for our express server
const express = require('express');
const genresRouter = require('../routes/genres');
const customersRouter = require('../routes/customers');
const moviesRouter = require('../routes/movies');
const rentalsRouter = require('../routes/rentals');
const usersRouter = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/genres', genresRouter);
    app.use('/api/customers', customersRouter);
    app.use('/api/movies', moviesRouter);
    app.use('/api/rentals', rentalsRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/auth', auth);
    app.use(error); // THIS SHOULD ALWAYS BE LAST MIDDLEWARE FUNCTION!
};