const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    let schema = Joi.object({
        name: Joi.string().required().min(5)
    });

    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;