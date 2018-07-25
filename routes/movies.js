const router = require('express').Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) { return res.status(400).send(error.details[0].message)};

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) { return res.status(404).send('Cannot find genre with that ID') };
    console.log(genre);
    try {
        let movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: 0,
            dailyRentalRate: 0,
        });
        movie = await movie.save();
        res.send(movie);
    } catch (ex) {
        res.send(ex.message);
    }
  
}); 


module.exports = router;