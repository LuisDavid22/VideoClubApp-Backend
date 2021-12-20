const auth = require('../middlewares/auth');
const { Genre, validate } = require('../models/genres');
const express = require('express');
const admin = require('../middlewares/admin');
//const Joi = require('joi');
const router = express.Router();

router.get('/', (req, res) => {
  throw new Error('test');
  Genre.find()
    .then((genres) => res.send(genres))
    .catch((err) => res.status(400).send(err));
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Genre.findById(id)
    .then((genre) => res.send(genre))
    .catch(() => res.status(404).send(`The given genre was not found`));
});

router.post('/', auth, (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });

  genre.save().then((result) => res.status(201).send(result));
});

router.put('/:id', auth, (req, res) => {
  Genre.findById(req.params.id)
    .then((genre) => {
      const { error } = validate(req.body);

      if (error) return res.status(400).send(error.details[0].message);

      genre.name = req.body.name;
      genre.save().then((result) => res.status(201).send(result));
    })
    .catch((err) => res.status(404).send(`The given genre was not found`));
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  res.send(genre);
});

module.exports = router;
