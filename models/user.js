import { v4 as uuidv4 } from 'uuid'

import validate from 'validate.js'
import constraints from '../lib/constraints.js'
import DB from '../lib/db.js'
import bcrypt from 'bcrypt'

let _ = class User {
  constructor () {
    this.created = Date.now()
    this.id = uuidv4()
    this.username = null
    this.email = null
    this.security = {
      passwordHash: null
    }
    this.admin = false
  }

  async save (data) {
    const { email } = data
    const user = await DB.findByEmail(email)
    if (user) {
      return false
    }
    await DB.write(data)
    return true
  }

  find (id) {
    return ''
  }

  setUsername (username) {
    try {
      username = username?.trim().replace(/  +/g, '')
      const msg = validate.single(username, constraints.name)
      if (msg) {
        return msg
      }
      this.username = username
    } catch (e) {
      throw new Error(e)
    }
  }

  setEmail (email) {
    try {
      const msg = validate.single(email, constraints.email)
      if (msg) {
        return msg
      }
      this.email = email
    } catch (e) {
      throw new Error(e)
    }
  }

  async setPassword (password) {
    try {
      const msg = validate.single(password, constraints.password)
      if (msg) {
        return msg
      }
      this.security.passwordHash = await bcrypt.hash(password, 10)
    } catch (e) {
      throw new Error(e)
    }
  }
}

export default _
