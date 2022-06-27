import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

// Models para relaciones

export const Film = sequelize.define('Film', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING
  },
  creation_date: {
    type: DataTypes.DATE
  },
  qualification: {
    type: DataTypes.INTEGER
  }
})
