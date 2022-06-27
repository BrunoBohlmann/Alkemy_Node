import { Router } from 'express'

// Import controllers
import {
    createCharacter,
    deleteCharacter,
    getAllCharacters,
    getCharacterById,
    updateCharacter
} from '../controllers/characters.controllers'

const router = Router()

// Gets
router.get('/', getAllCharacters)
router.get('/:id', getCharacterById)

// Create
router.post('/', createCharacter)
// Update
router.put('/:id', updateCharacter)
// Delete
router.delete('/:id', deleteCharacter)

export default router
