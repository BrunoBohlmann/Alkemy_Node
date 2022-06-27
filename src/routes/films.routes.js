import { Router } from 'express'

// Import controllers
import {
  createFilm,
  deleteFilm,
  getAllFilms,
  getFilmById,
  updateFilm
} from '../controllers/films.controllers'

const router = Router()

router.get('/', getAllFilms)
router.get('/:id', getFilmById)

router.post('/', createFilm)

router.delete('/:id', deleteFilm)

router.put('/:id', updateFilm)
export default router
