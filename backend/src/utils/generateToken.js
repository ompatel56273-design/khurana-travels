const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

module.exports = (token) => {
  return jwt.sign({ id: token }, JWT_SECRET, {
    expiresIn: '7d',
  });
};
