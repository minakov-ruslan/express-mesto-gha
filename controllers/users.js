const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SecretKey } = require('../utils/constants');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ConflictError = require('../utils/errors/ConflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId).orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Неверный запрос. Запрашиваемый пользователь не найден'));
      }
      return next(err);
    });
};
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
    _id,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
      _id,
    }))
    .then((user) => {
      const resUser = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      };
      res.send({ data: resUser });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с даным email уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка валидации'));
      }
      return next(err);
    });
};
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка валидации'));
      }
      return next(err);
    });
};
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка валидации'));
      }
      return next(err);
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SecretKey, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Неверный запрос. Запрашиваемый пользователь не найден'));
      }
      return next(err);
    });
};
