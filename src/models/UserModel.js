import { DataTypes } from 'sequelize'
import sequelize from '../db'
import bcrypt from 'bcrypt'

const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'The username must be a valid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    hooks: {
      beforeCreate: async function (user) {
        user.password = await bcrypt.hash(user.password, 10)
      }
    }
  }
)

User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export default User
