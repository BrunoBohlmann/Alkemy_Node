const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
import multer from 'multer'

// Import de Routes principales
import charactersRoutes from './routes/characters.routes'
import filmsRoutes from './routes/films.routes'
import authRoutes from './routes/auth.routes'

const app = express()

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(morgan('dev'))
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

// Middlewares

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage })

app.use(
  multer({
    storage,
    limits: { fileSize: 1000000 }
  }).single('image')
)

// Routes
app.use('/api/characters', charactersRoutes)
app.use('/api/movies', filmsRoutes)
app.use('/api/auth', authRoutes)
export default app
