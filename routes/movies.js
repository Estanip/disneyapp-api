const { Router } = require('express');
const { getMovies, getMovieDetails, createMovie, deleteMovie, updateMovie } = require('../controllers/movies');

const router = Router();

router.get('/', getMovies)
router.get('/details/:id', getMovieDetails)
router.post('/create', createMovie)
router.delete('/delete/:id', deleteMovie);
router.put('/update/:id', updateMovie);

module.exports = router;