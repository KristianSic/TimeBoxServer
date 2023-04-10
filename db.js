'use strict'
import NodeCouchDb from 'node-couchdb'

const couch = new NodeCouchDb({
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS
  }
})

export default couch
