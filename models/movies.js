const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genres');

const Movie = new mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        min: 3,
        max: 50,
        required: true
    },
    genre: genreSchema,
    numberInStock: {
        type: Number,
        min: 0,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        min: 0
    }
}));

const test = new mongoose.model('test', new mongoose.schema({}));

function validateMovie(movie) {
    let schema = Joi.object({
        title: Joi.string().required().min(5).max(50),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0)
    });

    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;