const router = require('express').Router();
const { paramsValidation, userValidation, avatarValidation } = require('../middlewares/validation');

const {
  getUsers, getUser, updateUser, getCurrentUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.get(
  '/users/:_id',
  paramsValidation,
  getUser,
);

router.patch(
  '/users/me',
  userValidation,
  updateUser,
);

router.patch(
  '/users/me/avatar',
  avatarValidation,
  updateAvatar,
);

module.exports = router;
