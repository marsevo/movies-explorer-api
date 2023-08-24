const ValidationError = require('../utils/errors/400-validationError');
const ForbiddenError = require('../utils/errors/403-errorForbidden');
const NotFoundError = require('../utils/errors/404-errorNotFound');
const Movie = require('../models/movie');

// Функция для обработки ошибок при работе с карточками фильмов
const handleMovieError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return next(new ValidationError('Переданные данные некорректны'));
  } if (err.name === 'CastError') {
    return next(new ValidationError('Переданные данные некорректны'));
  } if (err.name === 'DocumentNotFoundError') {
    return next(new NotFoundError('Карточка c фильмом не найдена'));
  }
  return next(err);
};

// Функция для создания новой карточки фильма
const createMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: _id,
  })
    .then((movie) => {
      // Возвращаем статус 201 и данные о созданной карточке
      res.status(201).json(movie);
    })
    .catch((err) => handleMovieError(err, req, res, next));
};

// Функция для удаления карточки по ID
const removeMovieById = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => new NotFoundError(`Фильм c Id: ${movieId} для удаления не найден`))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.deleteOne(movie)
          .then(() => res.status(200).send({ message: 'Карточка с фильмом удалена' }))
          .catch((err) => handleMovieError(err, req, res, next));
      } else {
        throw new ForbiddenError('Вы не можете удалить чужую карточку с фильмом');
      }
    })
    .catch((err) => handleMovieError(err, req, res, next));
};

// Контроллер для получения всех фильмов
const getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

module.exports = {
  createMovie,
  removeMovieById,
  getMovies,
};
