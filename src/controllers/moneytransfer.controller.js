// SQL Connection
import {
  getConnection,
  sql,
  queries
}
  from "../database";

// Auth validation
import { authorizeRequest } from "../middleware/auth"

// Transaction validation
import { missingParam } from "../helpers/validator";
import { moneyTransferSchema } from "../schema/investments.schema";

// Money transfer - exchange service
import { getExchangeRates } from "../services/exchange";

export const newTransfer = async (req, res) => {
  let authRequest = await authorizeRequest(req)

  const { originAccount, destinyAccount, amount, concept } = req.body

  const data = missingParam(req.body, moneyTransferSchema)
  if (data['valid'] == false) {
    const error = data.message
    res.json({ 'error': error })
    return false
  }

  if (authRequest.valid == false) {
    res.status(401)
    res.send('Unauthorized')
  } else {
    if (originAccount == destinyAccount) return

    try {
      const pool = await getConnection()

      const originCurrency = await pool
        .request()
        .input('id', sql.Int, originAccount)
        .query(queries.getCurrency)

      const destinyCurrency = await pool
        .request()
        .input('id', sql.Int, destinyAccount)
        .query(queries.getCurrency)

      let exchangedAmount;

      if (originCurrency.recordset[0]['Currency'].localeCompare(destinyCurrency.recordset[0]['Currency']) != 0) {
        const exchangeResult = await getExchangeRates(originCurrency.recordset[0]['Currency'], destinyCurrency.recordset[0]['Currency'])
        exchangedAmount = amount / exchangeResult.data.data[`${originCurrency.recordset[0]['Currency']}`].value
      } else {
        exchangedAmount = amount
      }

      await pool
        .request()
        .input('userId', sql.Int, authRequest.user)
        .input('originAccount', sql.Int, originAccount)
        .input('destinyAccount', sql.Int, destinyAccount)
        .input('amount', sql.Float, amount)
        .input('exchangedAmount', sql.Float, Math.round(exchangedAmount * 100) / 100)
        .input('concept', sql.VarChar, concept)
        .input('creationDate', sql.DateTime, new Date())
        .query(queries.addNewTransfer)

      res.json({ msg: 'Transfer created' })
    } catch (error) {
      res.json(error)
    }
  }
}
