const Joi = require('joi');
const mongoose = require('mongoose');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5
    }
}));

function validateGenre(genre) {
    let schema = Joi.object({
        name: Joi.string().required().min(5)
    });

    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;