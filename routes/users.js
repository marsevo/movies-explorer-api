const router = require('express').Router();

const { getUserInfo, updateUserProfile } = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/celebrate');

router.get('/me', getUserInfo);
router.patch('/me', validateUpdateUser, updateUserProfile);

module.exports = router;
