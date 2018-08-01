const validateObjectId = require('../middleware/validateObjectId');
const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, validate } = require('../models/genre');
const router = require('express').Router();

router.get('/', asyncMiddleware(async (req, res, next) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
}));

router.post('/', auth, asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) { return res.status(400).send(error.details[0].message) };
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
}));

router.get('/:id', validateObjectId ,asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    res.send(genre);
    console.error(ex.message);
    return res.status(404).send('Cannot find article with that ID');
}));

router.put('/:id', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (!error) { return res.status(400).send(error.details[0].message); }
        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
            new: true,
        });
        res.send(genre);
    } catch (ex) {
        console.error(ex.message);
        return res.status(404).send('The genre with the given ID was not found');
    }
});

router.delete('/:id',[auth, admin], async (req, res) => {
    try {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        res.send(genre);
    } catch (ex) {
        console.error(ex.message);
        return res.status(404).send('Cannot find genre with that id');
    }
});

module.exports = router;