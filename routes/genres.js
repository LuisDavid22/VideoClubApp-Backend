const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');

// const genres = [
//     {id:1,name:"Action"},
//     {id:2,name:"Horror"},
//     {id:3,name:"Romance"},   
//     {id:4,name:"Comedy"},
//   ];


const genreSchema = new mongoose.Schema({
    //id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    name: {
        type: String,
        required: true,
        min: 5
    }
});

const Genre = mongoose.model('Genre', genreSchema);

router.get('/', (req, res) => {
    Genre.find()
        .then((genres) => res.send(genres))
        .catch((err) => res.status(400).send(err));

});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Genre.findById(id)
        .then(genre => res.send(genre))
        .catch((err) => res.status(404).send(`The given genre is was not found`))


    // let genre = genres.find(g => g.id === +req.params.id);

    // if (!genre) return res.status(404).send('The given genre is was not found');

    // res.send(genre);
});

router.post('/', (req, res) => {
    const { error } = validateGenre(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    genre.save()
        .then(result => res.status(201).send(result));

    // genres.push(genre);

    // res.status(201).send(genre);

});

router.put('/:id', (req, res) => {
    Genre.findById(req.params.id)
        .then(genre => {
            const { error } = validateGenre(req.body);

            if (error) return res.status(400).send(error.details[0].message);

            genre.name = req.body.name;
            genre.save().then(result => res.status(201).send(result));
        })
        .catch((err) => res.status(404).send(`The given genre was not found`));

    //let genre = genres.find(g => g.id === +req.params.id);

    // if (!genre) return res.status(404).send('The given genre was not found');

    // const { error } = validateGenre(req.body);

    // if (error) return res.status(400).send(error.details[0].message);

    // genre.name = req.body.name;

    // res.status(201).send(genre);

});

router.delete('/:id', (req, res) => {
    Genre.findByIdAndDelete(req.params.id)
        .then(result => res.send(result));

    // let genre = genres.find(g => g.id === +req.params.id);

    // if (!genre) return res.status(404).send('The given genre is was not found');

    // let index = genres.indexOf(genre);
    // res.send(genres.splice(index, 1));
});

function validateGenre(genre) {
    let schema = Joi.object({
        name: Joi.string().required().min(5)
    });

    return schema.validate(genre);
}

module.exports = router;