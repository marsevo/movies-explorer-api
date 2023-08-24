const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { createUser, login, logout } = require('../controllers/users');
const { validateCreateUser, validateLogin } = require('../middlewares/celebrate');

const NotFoundError = require('../utils/errors/404-errorNotFound');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);
router.get('/signout', logout);

router.use(auth); // auth только здесь

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
