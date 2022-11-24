const jwt = require('jsonwebtoken')
import { config } from 'dotenv'
config()

import {
  getConnection,
  sql,
  queries
}
  from "../database";

export const signToken = (userId, role) => {
  let token = jwt.sign({userId, role: role}, process.env.SECRET_KEY, {expiresIn: '3h'})
  return token
}

export const authorizeRequest = async (req) => {
  let token = req.headers['authorization']

  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY)
    const pool = await getConnection()
    let result = await pool
      .request()
      .input('id', sql.Int, parseInt(decoded.userId))
      .query(queries.getUserById)

    let user = result.recordset
    let exists = null

    if (user.length == 1) {
      exists = true
    } else {
      exists = false
    }

    return {exists, role: decoded.role, user: decoded.userId}
  } catch (error) {
    return {msg: 'Invalid token.', valid: false}
  }
}
