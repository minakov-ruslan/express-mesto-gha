const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { SecretKey } = require('../utils/constants');

const error = new UnauthorizedError('Необходима авторизация');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(error);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SecretKey);
  } catch (err) {
    return next(error);
  }
  req.user = payload;
  return next();
};
