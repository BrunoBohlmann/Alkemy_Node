import { Router } from 'express'
const router = Router()

// Import de controllers
import { SignUp, SignIn } from '../controllers/auth.controllers'

router.post('/signin', SignIn)
router.post('/signup', SignUp)

export default router
