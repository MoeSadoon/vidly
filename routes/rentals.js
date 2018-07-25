const auth = require('../middleware/auth');
const router = require('express').Router();
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const mongoose = require('mongoose');
const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('dateOut');
    res.send(rentals);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) { return res.status(400).send(error.message) };

    const customer = await Customer.findById(req.body.customerId);
    const movie = await Movie.findById(req.body.movieId);
    if (movie.numberInStock === 0) { return res.status(404).send('This movie is out of stock') };     
  
    let rental = new Rental({
        customer: { 
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {
                $inc: {
                    numberInStock: -1,
                },
            })
            .run();
    
        res.send(rental);
    } catch (ex) {
        res.status(500).send(ex.message);
    }
});

module.exports = router;
