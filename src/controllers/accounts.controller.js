import {
  getConnection,
  sql,
  queries
}
  from "../database";
import { validCurrencyTypes } from '../helpers/account_validations'
import { authorizeRequest } from "../middleware/auth"

export const getAccounts = async (req, res) => {
  let authRequest = await authorizeRequest(req)

  if (authRequest.valid == false || authRequest.role != 'admin') {
    res.status(401)
    res.send('Unauthorized')
  } else {
    try {
      const pool = await getConnection()
      const result = await pool
        .request()
        .query(queries.getAllAccounts)

      res.json(result.recordset)
    } catch (err) {
      res.json(err)
    }
  }
}

export const addAccount = async (req, res) => {
  const currency = req.body.currency || 'ARS'
  let authRequest = await authorizeRequest(req)
  let user = null
  if (authRequest.exists == true) user = parseInt(authRequest.user)

  if (validCurrencyTypes(currency) == false) {
    res.status(406)
    res.send('Invalid currency types. We only support ARS, EUR and USD.')
  } else {
    try {
      const pool = await getConnection()
      await pool
        .request()
        .input('id', sql.Int, user)
        .input('currency', sql.VarChar, currency)
        .query(queries.createAccount)

      res.status(201)
      res.json({ msg: 'Account created' })
    } catch (err) {
      res.json(err)
    }
  }
}

export const deleteAccount = async (req, res) => {
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
        .query(queries.deleteAccountById)

      res.status(204)
    } catch (err) {
      res.json(err)
    }
  }
}
