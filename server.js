import express from 'express'
import NodeCouchDb from 'node-couchdb'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import router from './lib/router.js'
import passport from 'passport'
import DB from './lib/db.js'
import session from 'express-session'
import { Strategy } from 'passport-local'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080
const couch = new NodeCouchDb({
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS
  }
})

couch.listDatabases().then(dbs => dbs.map(db => console.log({ db })))
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/v1', router)

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await DB.login(username, password)
      done(null, user)
    } catch (error) {
      done(null, false, { message: 'User not found.' })
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

global.db = couch
global.pass = passport
