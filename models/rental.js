const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

/* Using custom schemas instead of the already available customer and 
   movie schemas because we don't need all the information from them
 */

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50.
            },
            isGold: {
                type: Boolean,
                default: false,
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50,
            },
        }),
        required: true,
    },

    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255,
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255,
            },
        }),
        required: true,
    },

    dateOut: {
        type: Date,
        required: true,
        default: Date.now(),
    },

    dateReturned: {
        type: Date,
    },

    rentalFee: {
        type: Number,
        min: 0,
    },
}));

function validateRental(reqBody) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    };
    return Joi.validate(reqBody, schema);
};

module.exports = {
    Rental,
    validate: validateRental,
};