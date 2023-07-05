import jwt from 'jsonwebtoken';

const signToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SERCRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = signToken;
