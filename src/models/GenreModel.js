import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

export const Genre = sequelize.define('Genre', {
  name: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.STRING
  }
})
