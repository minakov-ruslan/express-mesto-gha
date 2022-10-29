const Card = require('../models/card');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERAL_SERVER,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_INTERAL_SERVER).send({ message: 'На сервере произошла ошибка' }));
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Ошибка валидации' });
      } else {
        res.status(ERROR_INTERAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Неверный запрос. Запрашиваемая карточка не найдена' });
      } else {
        res.status(ERROR_INTERAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Неверный запрос. Запрашиваемая карточка не найдена' });
      } else {
        res.status(ERROR_INTERAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Неверный запрос. Запрашиваемая карточка не найдена' });
      } else {
        res.status(ERROR_INTERAL_SERVER).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
