const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genres');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
        trim: true
    },
    genre: {
        type:genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        minlength: 0,
        maxlength: 255,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        maxlength: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema );

function validateMovie(movie) {
    let schema = Joi.object({
        title: Joi.string().required().min(5).max(50),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0)
    });

    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
