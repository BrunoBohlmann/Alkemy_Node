import { DataTypes } from 'sequelize'
import sequelize from '../db'

export const Character = sequelize.define(
  'Character',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    weight: {
      type: DataTypes.INTEGER
    },
    image: {
      type: DataTypes.STRING
    },
    age: {
      type: DataTypes.INTEGER
    },
    history: {
      type: DataTypes.STRING
    }
  },
  { timeStamps: true }
)
