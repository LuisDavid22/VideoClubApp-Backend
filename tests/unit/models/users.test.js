const { User } = require('../../../models/users');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('generateAuthToken', () => {
  it('Should return a jwt token', () => {
    const payload = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const decoded = jwt.verify(
      user.generateAuthToken(),
      config.get('jwtPrivateKey')
    );

    expect(decoded).toMatchObject(payload);
  });
});
