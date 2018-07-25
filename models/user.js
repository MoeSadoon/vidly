const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024,
    },
    isAdmin: {
        type: Boolean,
    }
});

/*  INFORMATION EXPERT PRINCIPLE - userSchema should generate token  */
userSchema.methods.generateAuthToken = function() {
    return jwt.sign( {
        _id: this._id,
        isAdmin: this.isAdmin,
    }, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);

function validateUser(reqBody) {
    const schema = {
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required(),
    };

    return Joi.validate(reqBody, schema);
};

module.exports = {
    User,
    validate: validateUser,
};