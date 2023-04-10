import express from 'express'
import bcrypt from 'bcrypt'

const router = express.Router()

router.get('/register', (req, res) => {
  console.log('Time: ', Date.now())
  res.send('/register')
})

router.post('/register', (req, res) => {
  const { username, email, password } = req.body
  db.mango('timebox', {
    selector: {
      email: { $eq: email }
    },
    fields: ['_id', '_rev', 'title', 'hello', 'date']
  }).then(
    ({ data }) => {
      const { docs } = data
      if (docs.length) {
        res.json({ error: 'email already in use' })
      } else {
        const saltRounds = 10
        bcrypt.hash(password, saltRounds, (err, hash) => {
          db.insert('timebox', {
            username,
            email,
            hash
          }).then(
            () => {
              res.json({ register: 'user registration successfull' })
            },
            err => {}
          )
        })
      }
    },
    err => {
      console.log({ err })
    }
  )
})

router.get('/login', (req, res) => {
  console.log('Time: ', Date.now())
  res.send('/login')
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  db.mango('timebox', {
    selector: {
      email: { $eq: email }
    },
    fields: ['_id', 'hash']
  }).then(({ data }) => {
    const { docs } = data
    const { hash } = docs[0]
    bcrypt.compare(password, hash, (err, result) => {
      if (result) {
        res.json({ login: 'user login successfull' })
      } else {
        res.json({ login: 'user login failed' })
      }
    })
  })
})

export default router
