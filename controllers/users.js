const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');

const ValidationError = require('../utils/errors/400-validationError');
const AuthError = require('../utils/errors/401-authError');
const NotFoundError = require('../utils/errors/404-errorNotFound');
const ConflictError = require('../utils/errors/409-conflictError');

const User = require('../models/user');

// Функция для обработки ошибок при работе с пользователями
const handleUserError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return next(new ValidationError('Переданные данные некорректны'));
  } if (err.name === 'CastError') {
    return next(new ValidationError('Переданные данные некорректны'));
  } if (err.name === 'DocumentNotFoundError') {
    return next(new NotFoundError('Пользователь не найден'));
  } if (err.code === 11000) {
    return next(new ConflictError('Такой email уже зарегистрирован'));
  }
  return next(err);
};

// Функция для обработки создания нового пользователя
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hashedPassword,
    });
    // Возвращаем статус 201 и данные о созданном пользователе
    res.status(201).json(user.toJSON());
  } catch (err) {
    handleUserError(err, req, res, next);
  }
};

// Функция для обработки запроса пользователя по ID
const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => handleUserError(err, req, res, next));
};

// Функция для обработки входа пользователя
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthError('Пользователь не найден');
    }
    const isValidUser = await bcrypt.compare(password, user.password);
    if (!isValidUser) {
      throw new AuthError('Неверный пароль');
    }
    const expiresIn = '7d';
    const jwt = jsonWebToken.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn });
    res.status(200).send({ token: jwt });
  } catch (err) {
    next(err);
  }
};

// Функция для обработки запроса информации о пользователе по ID
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с указанным id не зарегистрирован'))
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, req, res, next));
};

// Функция для обновления профиля пользователя
const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, req, res, next));
};

// Выход из аккаунта
const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы вышли из аккаунта' });
};

module.exports = {
  createUser,
  getUserById,
  login,
  logout,
  getUserInfo,
  updateUserProfile,
};
