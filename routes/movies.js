const router = require('express').Router();
const { getMovies, createMovie, removeMovieById } = require('../controllers/movies');
const { validateCreateMovie, validateRemoveMovieById } = require('../middlewares/celebrate');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);

router.delete('/:movieId', validateRemoveMovieById, removeMovieById);

module.exports = router;
