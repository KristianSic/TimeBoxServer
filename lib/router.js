import express from 'express'
import User from '../models/user.js'
import passport from 'passport'

let _ = express.Router()

const exemptedRoutes = ['/login', '/register']

// AUTH GUARD
_.use((req, res, next) => {
  if (exemptedRoutes.includes(req.path)) {
    return next()
  }
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).send('Unauthorized')
})

// GET /test
_.get('/test', (req, res) => {
  res.json(req.session)
})

// POST /register
_.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    const user = new User()
    let msg = null

    msg = user.setUsername(username)
    if (msg) {
      return res.status(400).json({
        type: 'username',
        message: msg,
        code: 400
      })
    }
    msg = user.setEmail(email)
    if (msg) {
      return res.status(400).json({
        type: 'email',
        message: msg,
        code: 400
      })
    }
    msg = await user.setPassword(password)
    if (msg) {
      return res.status(400).json({
        type: 'password',
        message: msg,
        code: 400
      })
    }
    const already_registered = await user.save(user)
    if (already_registered) {
      return res.status(400).json({
        message: `${username} already registered`,
        code: 400
      })
    }
    res.status(200).json(user)
  } catch (e) {
    console.log({ e })
    throw new Error(e)
  }
})

// POST /login

_.post('/login', passport.authenticate('local', {}), (req, res) => {
  res.json(req.user)
})

// POST /logout
_.post('/logout', async (req, res) => {
  try {
    res.status(200).json({
      timestamp: Date.now(),
      message: '[Logged out successfully]',
      code: 200
    })
  } catch (e) {
    throw new Error(e)
  }
})

// DELETE /logout
_.delete('/logout', (req, res) => {
  req.session.destroy(err => {
    res.status(200).send('Logged out successfully')
  })
})

// ALL /*
_.all('*', async (req, res) => {
  try {
    res.status(404).json({
      timestamp: Date.now(),
      message: '[invalid route]',
      code: 404
    })
  } catch (e) {
    throw new Error(e)
  }
})

export default _
