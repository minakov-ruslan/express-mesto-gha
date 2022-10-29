const User = require('../models/user');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERAL_SERVER,
} = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_INTERAL_SERVER).send({ message: 'На сервере произошла ошибка' }));
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId).orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Неверный запрос. Запрашиваемый пользователь не найден' });
      } else {
        res.status(ERROR_INTERAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации' });
      } else {
        res.status(ERROR_INTERAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации' });
      } else {
        res.status(ERROR_INTERAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации' });
      } else {
        res.status(ERROR_INTERAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
