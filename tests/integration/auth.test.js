const request = require('supertest');
const { Genre } = require('../../models/genres');
const { User } = require('../../models/users');

describe('auth middleware', () => {
  let server;
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    //await server.close();
    await Genre.deleteMany({});
  });

  let token;

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' });
  };

  it('Should return 401 if no token is provided', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('Should return 400 if token is invalid', async () => {
    token = 'abc';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('Should return 200 if token is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(201);
  });
});
