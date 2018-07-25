const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20,
    },
})

const Genre = mongoose.model('Genre',  genreSchema);

function validateGenre(body) {
    const schema = {
        name: Joi.string().min(4).max(20).required(),
    };
    return Joi.validate(body, schema);
};

module.exports = {
    genreSchema,
    Genre,
    validate: validateGenre,
};
