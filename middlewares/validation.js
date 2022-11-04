const { celebrate, Joi } = require('celebrate');
const { Url } = require('../utils/constants');

module.exports.createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(Url),
  }),
});
module.exports.getCardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

module.exports.getLoggedUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(Url),
  }),
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});
module.exports.getUnloggedUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(Url),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
