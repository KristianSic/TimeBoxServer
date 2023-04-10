import express from 'express'
import NodeCouchDb from 'node-couchdb'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import router from './router.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.get('/', (req, res) => {
  res.json({ TIME: 'BOX' })
})

const couch = new NodeCouchDb({
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS
  }
})

global.db = couch

couch.listDatabases().then(
  dbs =>
    dbs.map(db => {
      console.log({ db })
    }),
  err => {
    console.log({ err })
  }
)

app.use('/api/v1', router)

app.use((err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal Server Error'
  res.status(err.statusCode).json({
    message: err.message
  })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
