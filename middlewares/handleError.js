const { DEFAULT_ERROR } = require('../utils/errors/errors');

const errorHandler = (err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR, message } = err;
  res.status(err.statusCode).send({
    message: statusCode === DEFAULT_ERROR ? 'Произошла ошибка на сервере' : message,
  });
  next();
};

module.exports = errorHandler;
