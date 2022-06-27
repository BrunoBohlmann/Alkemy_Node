import app from './app.js'
import sequelize from './db.js'
import 'dotenv/config'
import configDatabase from './config/database.config'

// Modelos
let PORT_NUMBER = process.env.DB_PORT || 3001

configDatabase(sequelize)

async function main() {
  try {
    app.listen(PORT_NUMBER, () => {
      console.log(`Servidor corriendo en el puerto ${PORT_NUMBER}`)
    })
  } catch (error) {
    console.error('Unable to connect to the DB', error)
  }
}

main()
