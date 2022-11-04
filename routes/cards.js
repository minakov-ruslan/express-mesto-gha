const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { createCardValidation, getCardIdValidation } = require('../middlewares/validation');

router.get('/cards', getCards);
router.post('/cards', createCardValidation, createCard);
router.delete('/cards/:cardId', getCardIdValidation, deleteCard);
router.put('/cards/:cardId/likes', getCardIdValidation, likeCard);
router.delete('/cards/:cardId/likes', getCardIdValidation, dislikeCard);

module.exports = router;
