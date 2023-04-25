import express from 'express'
import User from '../models/user.js'
import DB from '../lib/db.js'
import passport from 'passport'
import jwt from 'jsonwebtoken'

let _ = express.Router()

const exemptedRoutes = ['/login', '/register']

// AUTH GUARD
_.use((req, res, next) => {
  if (exemptedRoutes.includes(req.path)) return next()
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (user) {
      req.user = user
      return next()
    }
    return res.status(401).json({ message: 'Unauthorized' })
  })(req, res, next)
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

_.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await DB.login(username, password)
    const payload = {
      username,
      id: user._id
    }
    const secret = 'time:box'
    const token = jwt.sign(payload, secret, { expiresIn: '1d' })

    res.status(200).json({
      timestamp: Date.now(),
      message: 'Logged in successfully',
      user,
      token,
      code: 200
    })
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
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

// GET /timebox
_.get('/timebox', async (req, res) => {
  const { id } = req.user
  const { _limit, _offset } = req.query

  const limit = _limit ? Number(_limit) : 100
  const offset = _offset ? Number(_offset) : 0

  const timeboxes = await DB.get({
    type: 'timebox',
    user: id,
    limit,
    offset
  })

  res.json({
    records: timeboxes,
    user: id,
    limit,
    offset
  })
})

// POST /timebox
_.post('/timebox', async (req, res) => {
  const { id } = req.user
  const data = req.body
  const timebox = await DB.set({
    type: 'timebox',
    user: id,
    data
  })
  res.json(timebox)
})

// ALL /*
_.all('*', async (req, res) => {
  try {
    res.status(404).json({
      timestamp: Date.now(),
      message: 'Invalid route',
      code: 404
    })
  } catch (e) {
    throw new Error(e)
  }
})

export default _
