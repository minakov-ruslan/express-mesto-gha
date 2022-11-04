const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');
const { getLoggedUserValidation } = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', getLoggedUserValidation, getUser);
router.patch('/users/me', getLoggedUserValidation, updateUserInfo);
router.patch('/users/me/avatar', getLoggedUserValidation, updateUserAvatar);

module.exports = router;
