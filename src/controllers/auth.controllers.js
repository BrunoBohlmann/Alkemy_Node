import UserModel from '../models/UserModel'
import { transporter } from '../libs/mailer'
import jwt from 'jsonwebtoken'

// Handle error
const catchError = (error, res) =>
  res.status(400).json({
    status: 'failed',
    message: 'Something went wrong, try again',
    error
  })

export const SignIn = async (req, res) => {
  const { password, username } = req.body
  try {
    // Si no llega toda la informacion
    if (!(password || username)) {
      return res.status(400).json({
        status: 'failed',
        message: 'All fields al required'
      })
    }

    const userExists = await UserModel.findOne({
      where: {
        username
      }
    })

    // Si el usuario ya existe
    if (userExists) {
      return res.status(400).json({
        status: 'failed',
        message: 'This user already exists'
      })
    }

    // Creo nuevo usuario

    let user = await UserModel.create({
      username,
      password
    })

    // Verification mail
    await transporter.sendMail({
      from: 'Welcome', // sender address
      to: user.username, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Have a good time', // plain text body
      html: `<b>Please check the following link, or paste into your browser to complete the confirm process</b>`
    })

    // Creo token para confirmar correo
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username
      },
      'Alkemy',
      {
        expiresIn: 86400
      }
    )
    console.log('llego')

    return res.status(201).json({
      status: 'succes',
      message: 'User succesfully registered',
      user: { id: user.id, username: user.username },
      token
    })
  } catch (error) {
    return catchError(error, res)
  }
}

export const SignUp = async (req, res) => {
  const { username, password } = req.body
  if (!username | !password) {
    return res
      .status(400)
      .json({ error: 'username and password are mandatory' })
  }
  try {
    const userExists = await UserModel.findOne({
      where: {
        username
      }
    })
    if (!userExists) {
      return res.status(404).json({ error: 'username has not be found' })
    }
    // Comparacion de password
    if (await userExists.comparePassword(password)) {
      // Refresco el token
      const token = jwt.sign(
        {
          id: userExists.id,
          username: userExists.username
        },
        'Alkemy',
        {
          expiresIn: 86400
        }
      )

      // Devuelvo
      return res.status(200).json({
        message: 'successfully logged in',
        user: {
          id: userExists.id,
          username: userExists.username
        },
        token
      })
    } else {
      return res.status(401).json({ error: 'password is not correct' })
    }
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}
