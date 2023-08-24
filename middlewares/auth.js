// получаем переменные из env среды
const { NODE_ENV, JWT_SECRET } = process.env;
// модуль для создания и подтверждения токенов
const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/401-authError');

const AuthErrorMessage = 'Необходима авторизация';

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      throw new AuthError(AuthErrorMessage);
    }
    const token = authorization.replace('Bearer ', '');
    const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
    const payload = jwt.verify(token, secretKey);
    req.user = payload;
    next();
  } catch (err) {
    next(new AuthError(AuthErrorMessage));
  }
};

module.exports = auth;
