import { Character as CharacterModel } from '../models/CharacterModel'
import { Film as FilmModel } from '../models/FilmModel'

// Respuesta de errores simple
const catchError = (error, res) =>
  res.status(400).json({
    status: 'failed',
    message: 'Something went wrong, try again',
    error
  })

// Traer todos los personajes
export const getAllCharacters = async (req, res) => {
  try {
    // Averiguo todos los personajes
    const allCharacters = await CharacterModel.findAll({
      where: req.query,
      attributes: ['id', 'name', 'image']
    })

    console.log(allCharacters)

    // Si no hay personajes
    if (allCharacters.length === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'Theres no characters on the database'
      })
    }

    // Devuelvo todos los personajes
    return res.status(200).json({
      status: 'succes',
      message: 'All characters required',
      allCharacters
    })
  } catch (error) {
    return catchError(error, res)
  }
}

//Traer un personaje
export const getCharacterById = async (req, res) => {
  const { id } = req.params
  try {
    // Averiguo si existe
    const character = await CharacterModel.findByPk(id, {
      include: {
        model: FilmModel,
        as: 'films',
        through: {
          attributes: []
        }
      }
    })

    // Si el personaje no existe
    if (!character)
      return res.status(404).json({
        status: 'failed',
        message: 'The characters not exists',
        character: null
      })

    // Devuelvo
    return res.status(200).json({
      status: 'succes',
      message: 'Character requested succesfully',
      character
    })
  } catch (error) {
    return catchError(error, res)
  }
}

// Crear personaje
export const createCharacter = async (req, res) => {
  const { name, age, weight, history, films } = req.body
  const image = req.file || null

  try {
    // Evaluo si existe el personaje
    const characterExists = await CharacterModel.findOne({
      where: {
        name
      }
    })

    if (characterExists)
      return res.status(400).json({
        status: 'failed',
        message: 'This characters already exists'
      })

    // Creamos el nuevo personaje si no existe
    const newCharacter = await CharacterModel.create({
      name,
      age,
      weight,
      history,
      image: image?.path
    })

    // Parseo el array ya que viene como string
    if (films) {
      var filmsArray = JSON.parse(films)
    }

    // Por cada id de movie que tiene, busco y agrego
    if (filmsArray) {
      for (let i = 0; i < filmsArray.length; i++) {
        let film = await FilmModel.findByPk(filmsArray[i])
        await newCharacter.addFilms(film)
      }
    }

    //Devuelvo el personaje creado
    if (newCharacter)
      return res.status(201).json({
        status: 'succes',
        message: 'Character created succesfuly',
        newCharacter
      })
  } catch (error) {
    return catchError(error, res)
  }
}

// Borrar personaje
export const deleteCharacter = async (req, res) => {
  const { id } = req.params
  try {
    // Se destruye el modelo
    const deletedCharacter = await CharacterModel.destroy({
      where: {
        id
      }
    })

    if (!deletedCharacter) {
      return res.status(404).json({
        status: 'failed',
        message: 'This character not exists',
        deletedCharacter: null
      })
    }

    // Response
    return res.status(200).json({
      status: 'succes',
      message: 'Character deleted succesfully',
      deletedCharacter
    })
  } catch (error) {
    return catchError(error, res)
  }
}

// Editar personaje
export const updateCharacter = async (req, res) => {
  const { id } = req.params
  const { name, age, weight, history, films } = req.body
  const image = req.file || null

  try {
    // Averiguo si existe el personaje
    const characterExists = await CharacterModel.findByPk(id)

    // Si el personaje no existe
    if (!characterExists) {
      return res.status(400).json({
        status: 'failed',
        message: 'This character not exists',
        characterExists: null
      })
    }

    // // // // // // // // // Actualizacion de objeto // // // // // // // // // // // //

    //Quito films de lo que trae el body, ya que necesita un proceso extra para agregarlos
    const body = { name, age, weight, history }

    // Combino los objetos
    Object.assign(characterExists, body)

    // Agrego el path de la imagen
    if (image) {
      characterExists.image = image.path
    }

    // Parseo el array de films ya que viene como string
    if (films) {
      var filmsArray = JSON.parse(films)
    }
    // Por cada id de movie que viene, busco y agrego al character
    if (filmsArray) {
      for (let i = 0; i < filmsArray.length; i++) {
        let film = await FilmModel.findByPk(filmsArray[i])
        await characterExists.addFilms(film)
      }
    }

    // Guardo
    await characterExists.save()

    // // // // // // // // // // // // // // // // // // // // // // // //

    return res.status(200).json({
      status: 'succes',
      message: 'Character updated succesfully',
      updatedCharacter: characterExists
    })
  } catch (error) {
    return catchError(error, res)
  }
}
