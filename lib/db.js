import bcrypt from 'bcrypt'

let _ = class DB {
  static async write (data) {
    if (data) {
      await db.insert('timebox', data)
      return data
    }
    return false
  }

  static async get ({ type, user, limit, offset }) {
    try {
      const {
        data: { docs }
      } = await db.mango('timebox', {
        selector: {
          type: { $eq: type },
          user: { $eq: user }
        },
        limit: Number(limit),
        skip: Number(offset)
      })
      return docs
    } catch (error) {
      return error
    }
  }

  static async set (data) {
    try {
      const res = await db.insert('timebox', data)
      return data
    } catch (error) {
      return error
    }
  }


  static async findById (id) {
    if (id) {
      const {
        data: { docs }
      } = await db.mango('timebox', {
        selector: {
          id: { $eq: id }
        },
        limit: 1
      })

      return docs[0]
    }
    return false
  }

  static async findByEmail (email) {
    if (email) {
      const {
        data: { docs }
      } = await db.mango('timebox', {
        selector: {
          email: { $eq: email }
        },
        limit: 1
      })
      return docs[0]
    }
    return false
  }

  static async login (username, password) {
    const {
      data: { docs }
    } = await db.mango('timebox', {
      selector: {
        username: { $eq: username }
      }
    })

    const user = docs[0]
    if (!user) {
      throw new Error('user does not exist')
    }
    const {
      security: { passwordHash }
    } = user

    const valid = bcrypt.compareSync(password, passwordHash)

    if (!valid) {
      throw new Error('invalid password')
    }
    return user
  }
}

export default _
