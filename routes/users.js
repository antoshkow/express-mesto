const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getUsers, getUser, updateUser, getCurrentUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.get(
  '/users/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().required().max(24),
    }),
  }),
  getUser,
);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2),
    }),
  }),
  updateUser,
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    }),
  }),
  updateAvatar,
);

module.exports = router;
