const { Router } = require('express');
const { createFilm, getFilms, getFilmBy, deleteFilm, updateFilm } = require('../controllers/films');

const router = Router();

router.get('/', getFilms)
router.get('/getBy', getFilmBy)
router.post('/create', createFilm)
router.delete('/delete/:id', deleteFilm);
router.put('/update/:id', updateFilm);

module.exports = router;