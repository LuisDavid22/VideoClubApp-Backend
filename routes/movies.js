const { Movie, validate } = require('../models/movies')
const { Genre } = require('../models/genres')
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
   const movies = await Movie.find().sort('name');

   res.send(movies);
});

router.get('/:id', async (req, res) => {
   const movie = await Movie.findById(req.params.id);

   if (!movie) return res.status(404).send('This movie id was not found');

   res.send(movie);
});

router.post('/', async (req, res) => {
   const { error } = validate(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const genre = await Genre.findById(req.body.genreId);
   if (!genre) return res.status(400).send('Invalid genre Id'); 

   let movie = new Movie({
      title: req.body.title,
      genre: {
         _id: genre._id,
         name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
   });

   movie = await movie.save();

   res.status(201).send(movie);
});

router.put('/:id', async (req, res) => {
   const { error } = validate(req.body);

   if (error) return res.status(400).send(error.details[0].message);

   const movie = await Movie.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      genre: req.body.genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
   }, { new: true })

   res.send(movie);
});

router.delete('/:id', async(req, res) => {
   try { 
       const movie = await Movie.findByIdAndDelete(req.params.id);

       req.send(movie);
   }
   catch(err){
       console.error('error');
       res.status(400).send();
   }    
});

module.exports = router;