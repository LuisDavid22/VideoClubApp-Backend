const express = require('express');
const router = express.Router();

const genres = [
    {id:1,name:"Action"},
    {id:2,name:"Horror"},
    {id:3,name:"Romance"},
    {id:4,name:"Comedy"},
  ];
  
  router.get('/', (req, res) =>{
      res.send(genres);
  });
  
  router.get('/:id', (req, res) =>{
      let genre = genres.find(g => g.id === +req.params.id);
  
      if(!genre) return res.status(404).send('The given genre is was not found');
  
      res.send(genre);
  });
  
  router.post('/', (req, res) =>{
      const {error} = validateGenre(req.body);
  
      if(error) return res.status(400).send(error.details[0].message);
      
      let genre = {id: genres.length + 1, name: req.body.name};
  
      genres.push(genre);
  
      res.status(201).send(genre);
  
  });
  
  router.put('/:id', (req, res) =>{
      let genre = genres.find(g => g.id === +req.params.id);
  
      if(!genre) return res.status(404).send('The given genre is was not found');
  
      const {error} = validateGenre(req.body);
  
      if(error) return res.status(400).send(error.details[0].message);
      
      genre.name = req.body.name;
  
      res.status(201).send(genre);
  
  });
  
  router.delete('/:id', (req, res) =>{
      let genre = genres.find(g => g.id === +req.params.id);
  
      if(!genre) return res.status(404).send('The given genre is was not found');
  
      let index = genres.indexOf(genre);
      res.send(genres.splice(index,1));
  });
  
  function validateGenre(genre){
      let schema = Joi.object({
          name: Joi.string().required().min(5)
      });
  
      return schema.validate(genre);
  }

  module.exports = router;