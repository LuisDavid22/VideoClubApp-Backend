const {Movie, validate} = require('../models/movies')
const express = require('express');
const router = express.Router();


router.get('/', async(req, res) => {
   const movies = await Movie.find().sort('name');

   res.send(movies);
});

router.get('/:id', async(req, res) =>{
//const movie = await Movie.findById()
});





module.exports = router;