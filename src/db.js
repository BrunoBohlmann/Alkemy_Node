import Sequelize from 'sequelize'
import 'dotenv/config'

const { DB_USER, DB_PASSWORD, DB_HOST } = process.env

const sequelize = new Sequelize('alkemy_node', DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false
})

export default sequelize
