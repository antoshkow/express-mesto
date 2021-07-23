const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    }),
  }),
  createCard,
);

router.delete(
  '/cards/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().required().length(24),
    }),
  }),
  deleteCard,
);

router.put(
  '/cards/:_id/likes',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().hex().length(24),
    }),
  }),
  likeCard,
);

router.delete(
  '/cards/:_id/likes',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().required().length(24),
    }),
  }),
  dislikeCard,
);

module.exports = router;
