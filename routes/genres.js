const { Router } = require('express');
const { getGenres, createGenre } = require('../controllers/genres');
const router = Router();

router.get('/', getGenres);
router.post('/create', createGenre);

module.exports = router;