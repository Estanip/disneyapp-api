const { Router } = require('express');
const { createCharacter, getCharacters, deleteCharacter, updateCharacter, getCharacterDetails } = require('../controllers/characters');

const router = Router();

router.get('/', getCharacters);
router.get('/details/:id', getCharacterDetails)
router.post('/create', createCharacter);
router.delete('/delete/:id', deleteCharacter);
router.put('/update/:id', updateCharacter);

module.exports = router;