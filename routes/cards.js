const router = require('express').Router();
const { paramsValidation, cardsValidation } = require('../middlewares/validation');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post(
  '/cards',
  cardsValidation,
  createCard,
);

router.delete(
  '/cards/:_id',
  paramsValidation,
  deleteCard,
);

router.put(
  '/cards/:_id/likes',
  paramsValidation,
  likeCard,
);

router.delete(
  '/cards/:_id/likes',
  paramsValidation,
  dislikeCard,
);

module.exports = router;
