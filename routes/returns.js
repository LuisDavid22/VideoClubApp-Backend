const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');
const auth = require('../middlewares/auth');
const Joi = require('joi');
const validator = require('../middlewares/validate');

router.post('/', [auth, validator(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found');

  if (rental.dateReturned)
    return res.status(400).send('Rental already processed');

  rental.return();

  await rental.save();

  await Movie.findByIdAndUpdate(
    req.body.movieId,
    {
      $inc: {
        numberInStock: 1,
      },
    },
    { useFindAndModify: false }
  );

  res.send(rental);
  //res.status(401).send('Unauthorized');
});

function validateReturn(req) {
  let schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

module.exports = router;
