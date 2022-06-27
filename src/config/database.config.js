import { Film } from '../models/FilmModel'
import { Character } from '../models/CharacterModel'
import { Genre } from '../models/GenreModel'

const mockDataBoolean = true

const configDatabase = async (sequelize) => {
  try {
    await sequelize.authenticate()
    Film.belongsToMany(Character, {
      as: 'characters',
      through: 'CharactersFilms'
    })
    Character.belongsToMany(Film, {
      as: 'films',
      through: 'CharactersFilms'
    })
    Film.belongsTo(Genre, { foreignKey: 'genre' })

    if (mockDataBoolean) {
      mockData(sequelize)
    } else {
      sequelize.sync()
    }

    console.log('Database connected...')
  } catch (error) {
    console.log(error)
  }
}

async function mockData(sequelize) {
  await sequelize.sync({ force: true })
  // await User.create({ username: 'camilamans197@gmail.com', password: '1234' })
  const char1 = await Character.create({ name: 'Mickey', age: 30 })
  const char2 = await Character.create({ name: 'Minie', age: 40 })
  const char3 = await Character.create({ name: 'Donald', age: 50 })
  const movie1 = await Film.create({ title: 'Tiburon' })
  const movie2 = await Film.create({ title: 'Matrix' })
  const movie3 = await Film.create({ title: 'Back to the future' })
  const genre1 = await Genre.create({ name: 'adventure' })
  const genre2 = await Genre.create({ name: 'thriller' })

  await char1.addFilms([movie1, movie2])
  await char2.addFilms([movie1, movie2, movie3])
  await char3.addFilms([movie3])
  await char1.save()
  await char2.save()
  await char3.save()

  await movie1.setGenre(genre1)
  await movie2.setGenre(genre2)
  await movie3.setGenre(genre1)
  await movie1.save()
  await movie2.save()
  await movie3.save()
}

export default configDatabase
