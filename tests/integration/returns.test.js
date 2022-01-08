const { Rental } = require('../../models/rentals');
const mongoose = require('mongoose');
const request = require('supertest');
const { User } = require('../../models/users');
const { Movie } = require('../../models/movies');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;
  let movie;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require('../../index');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User({}).generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: 'New movie',
      dailyRentalRate: 2,
      genre: { name: '12345' },
      numberInStock: 10,
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: 'new customer',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: 'New movie',
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });
  afterEach(async () => {
    //await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  it('should return 401 if client is not logged in', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {
    customerId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {
    movieId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 404 if no rental found for this customer/movie', async () => {
    movieId = mongoose.Types.ObjectId().toHexString();
    customerId = mongoose.Types.ObjectId().toHexString();

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it('should return 400 if rental already processed', async () => {
    rental.dateReturned = Date.now();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if request is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the returnDate if input is valid', async () => {
    const res = await exec();
    const result = await Rental.findById(rental._id);
    const diff = new Date() - result.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should calculate the rental fee if input is valid', async () => {
    await Rental.findByIdAndUpdate(rental._id, {
      dateOut: new Date('2022/01/05'),
    });

    const res = await exec();
    const result = await Rental.findById(rental._id);
    const diffInMs = new Date(result.dateReturned) - new Date(result.dateOut);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const fee = result.movie.dailyRentalRate * diffInDays;

    expect(result.rentalFee).toBe(Math.floor(fee));
  });

  it('should increrase the movie stock if input is valid', async () => {
    const res = await exec();
    const movieInDB = await Movie.findById(movieId);

    expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should return the rental object if input is valid', async () => {
    const res = await exec();

    const rentalInDB = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        'dateOut',
        'dateReturned',
        'rentalFee',
        'customer',
        'movie',
      ])
    );
  });
});
