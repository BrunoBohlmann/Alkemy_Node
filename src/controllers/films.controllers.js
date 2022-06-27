import { Film as FilmModel } from '../models/FilmModel'
import { Character as CharacterModel } from '../models/CharacterModel'

// Manejo de errores simple
const catchError = (error, res) =>
  res.status(400).json({
    status: 'failed',
    message: 'Something went wrong, try again',
    error
  })

export const getAllFilms = async (req, res) => {
  const { title, genre, order } = req.query
  try {
    // Especificaciones para filtrar
    let query = {}
    let titleOrder = []
    if (title) {
      query.title = title
    }
    if (genre) {
      query.genre = genre
    }
    if (order) {
      if (order === 'ASC') {
        titleOrder.push(['createdAt', 'ASC'])
      } else {
        titleOrder.push(['createdAt', 'DESC'])
      }
    }

    // Averiguo todos los films
    const allFilms = await FilmModel.findAll({
      where: query,
      order: titleOrder,
      attributes: ['id', 'title', 'image', 'creation_date']
    })

    // Si no hay films
    if (allFilms.length === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'Theres no films on the database'
      })
    }

    // Devuelvo todos los films
    return res.status(200).json({
      status: 'succes',
      message: 'All films required',
      allFilms
    })
  } catch (error) {
    return catchError(error, res)
  }
}

//Traer un film
export const getFilmById = async (req, res) => {
  const { id } = req.params
  try {
    // Averiguo si existe
    const film = await FilmModel.findByPk(id, {
      include: {
        model: CharacterModel,
        as: 'characters',
        through: {
          attributes: []
        }
      }
    })

    // Si el personaje no existe
    if (!film)
      return res.status(404).json({
        status: 'failed',
        message: 'The film not exists',
        film: null
      })

    // Devuelvo
    return res.status(200).json({
      status: 'succes',
      message: 'Film requested succesfully',
      film
    })
  } catch (error) {
    return catchError(error, res)
  }
}

// Crear personaje
export const createFilm = async (req, res) => {
  const { title, creation_date, qualification, characters } = req.body
  const image = req.file || null

  try {
    // Evaluo si existe el personaje
    const FilmExists = await FilmModel.findOne({
      where: {
        title
      }
    })

    if (FilmExists)
      return res.status(400).json({
        status: 'failed',
        message: 'This film already exists'
      })

    // Creamos el nuevo personaje si no existe
    const newFilm = await FilmModel.create({
      title,
      creation_date,
      qualification,
      image: image?.path
    })

    // Parseo el array ya que viene como string
    if (characters) {
      var charactersArray = JSON.parse(characters)
    }
    console.log(characters)
    // Por cada id de movie que tiene, busco y agrego
    if (charactersArray) {
      for (let i = 0; i < charactersArray.length; i++) {
        let character = await CharacterModel.findByPk(charactersArray[i])
        await newFilm.addCharacters(character)
      }
    }

    //Devuelvo el personaje creado
    if (newFilm)
      return res.status(201).json({
        status: 'succes',
        message: 'Film created succesfuly',
        newFilm
      })
  } catch (error) {
    return catchError(error, res)
  }
}

// Borrar personaje
export const deleteFilm = async (req, res) => {
  const { id } = req.params
  try {
    // Se destruye el modelo
    const deletedFilm = await FilmModel.destroy({
      where: {
        id
      }
    })

    if (!deletedFilm) {
      return res.status(404).json({
        status: 'failed',
        message: 'This film not exists',
        deletedFilm: null
      })
    }

    // Response
    return res.status(200).json({
      status: 'succes',
      message: 'Film deleted succesfully',
      deletedFilm
    })
  } catch (error) {
    return catchError(error, res)
  }
}

// Editar personaje
export const updateFilm = async (req, res) => {
  const { id } = req.params
  const { title, creation_date, qualification, characters } = req.body
  const image = req.file || null

  try {
    // Averiguo si existe el personaje
    const filmExists = await FilmModel.findByPk(id)

    // Si el personaje no existe
    if (!filmExists) {
      return res.status(400).json({
        status: 'failed',
        message: 'This film not exists',
        filmExists: null
      })
    }

    // // // // // // // // // Actualizacion de objeto // // // // // // // // // // // //

    //Quito films de lo que trae el body, ya que necesita un proceso extra para agregarlos
    const body = { title, creation_date, qualification }

    // Combino los objetos
    Object.assign(filmExists, body)

    // Agrego el path de la imagen
    if (image) {
      filmExists.image = image.path
    }

    // Parseo el array de films ya que viene como string
    if (characters) {
      var charactersArray = JSON.parse(characters)
    }

    console.log(charactersArray)

    // Por cada id de movie que viene, busco y agrego al character
    if (charactersArray) {
      for (let i = 0; i < charactersArray.length; i++) {
        let character = await CharacterModel.findByPk(charactersArray[i])
        await filmExists.addCharacters(character)
      }
    }

    // Guardo
    await filmExists.save()

    // // // // // // // // // // // // // // // // // // // // // // // //

    return res.status(200).json({
      status: 'succes',
      message: 'Film updated succesfully',
      updatedFilm: filmExists
    })
  } catch (error) {
    return catchError(error, res)
  }
}
