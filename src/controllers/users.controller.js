import {
  getConnection,
  sql,
  queries
}
  from "../database";
import { invalidIdType, missingParam, VALID_ID_TYPES } from '../helpers/user_validations'
import bcrypt from 'bcrypt'
import { authorizeRequest, signToken } from "../middleware/auth";

export const getAllUsers = async (req, res) => {
  let authRequest = await authorizeRequest(req)

  if (authRequest.valid == false || authRequest.role != 'admin') {
    res.status(401)
    res.send('Unauthorized')
  } else {
    try {
      const pool = await getConnection()
      const result = await pool.request().query(queries.getUsers)
      res.json(result.recordset)
    } catch (err) {
      res.status(500)
      res.send(err.message)
    }
  }
}

export const getUser = async (req, res) => {
  let authRequest = await authorizeRequest(req)
  const { id } = req.params

  if (authRequest.valid == false || authRequest.role != 'admin') {
    res.status(401)
    res.send('Unauthorized')
  } else {
    try {
      const pool = await getConnection()
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query(queries.getUserById)

      res.json(result.recordset[0])
    } catch (error) {
      res.status(500)
      res.send(err.message)
    }
  }
}

export const userAccounts = async (req, res) => {
  let authRequest = await authorizeRequest(req)
  const { id } = req.params

  if (authRequest.valid == false || authRequest.role != 'admin' && authRequest.user != id) {
    res.status(401)
    res.send('Unauthorized')
  } else {
    const pool = await getConnection()
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(queries.getUserAccounts)

    res.json(result.recordset)
  }
}

export const userTransactions = async (req, res) => {
  let authRequest = await authorizeRequest(req)
  const { id } = req.params

  if (authRequest.valid == false || authRequest.role != 'admin' && authRequest.user != id) {
    res.status(401)
    res.send('Unauthorized')
  } else {
    const pool = await getConnection()
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(queries.getUserTransactions)

    res.json(result.recordset)
  }
}

export const addNewUser = async (req, res) => {
  const {
    firstName,
    lastName,
    password,
    email,
    idType,
    idNumber,
    phoneNumberPrefix,
    phoneNumber,
    country
  } = req.body

  // Validations
  const data = missingParam(req.body)
  if (data['valid'] == false) {
    const error = data.message
    res.json({ 'error': error })
    return false
  }

  // Check for valid personal ID types
  if (invalidIdType(idType) == false) {
    res.json({ error: `Invalid ID type. Only valid types are: ${VALID_ID_TYPES}` })
    return false
  }

  // Encrypt password before saving to DB
  const encrypted_password = await bcrypt.hash(password, 12)

  try {
    // Query execution
    const pool = await getConnection()
    await pool
      .request()
      .input('firstName', sql.VarChar, firstName)
      .input('lastName', sql.VarChar, lastName)
      .input('password', sql.VarChar, encrypted_password)
      .input('email', sql.VarChar, email)
      .input('idType', sql.VarChar, idType)
      .input('idNumber', sql.Int, idNumber)
      .input('phoneNumberPrefix', sql.Int, phoneNumberPrefix)
      .input('phoneNumber', sql.Int, phoneNumber)
      .input('country', sql.VarChar, country)
      .input('creationDate', sql.DateTime, new Date())
      .query(queries.createUser)

    res.json({ message: 'User created successfully.' })
  } catch (err) {
    if (err.originalError.info.number == 2601) {
      res.json({ 'Error': 'Email already in use' })
    }
    else {
      res.json({ 'Error': err })
    }
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params
  let authRequest = await authorizeRequest(req)

  if (authRequest.valid == false || authRequest.role != 'admin') {
    res.status(401)
    res.send('Unauthorized')
  } else {
    try {
      const pool = await getConnection()
      await pool
        .request()
        .input('id', sql.Int, id)
        .query(queries.deleteUserById)
      res.status(204)
      res.send('User deleted successfully')
    } catch (err) {
      res.json(err)
    }
  }
}

export const logIn = async (req, res) => {
  const { email, password } = req.body

  try {
    const pool = await getConnection()
    let result = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query(queries.getUserByEmail)

    let user = result.recordset[0]

    bcrypt.compare(password, user.Password, (err, result) => {
      if (err) return err

      if (result == false) {
        res.json({ msg: "There's been an error with your login information" })
        res.status(400)
      } else {
        let token = signToken(user.UserId, user.UserRole)
        res.json({ msg: 'You have successfully logged in', token: token })
      }
    })
  } catch (error) {
    res.json(error)
  }
}



