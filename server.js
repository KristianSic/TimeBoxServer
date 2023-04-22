import express from 'express'
import NodeCouchDb from 'node-couchdb'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import router from './lib/router.js'
import passport from 'passport'
import { setupJWTstrategy } from './lib/passport.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080
const couch = new NodeCouchDb({
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS
  }
})

app.use(passport.initialize())
setupJWTstrategy()

couch.listDatabases().then(dbs => dbs.map(db => console.log({ db })))

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/v1', router)

global.db = couch
