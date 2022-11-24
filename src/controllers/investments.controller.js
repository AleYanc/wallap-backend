import {
  getConnection,
  sql,
  queries
}
  from "../database";
import { authorizeRequest } from "../middleware/auth"
import { investmentsSchema } from "../schema/investments.schema";

export const newInvestment = async (req, res) => {
  let authRequest = await authorizeRequest(req)

  const { accountId, amount } = req.body

  const data = missingParam(req.body, investmentsSchema)
  if (data['valid'] == false) {
    const error = data.message
    res.json({ 'error': error })
    return false
  }

  if (authRequest.valid == false) {
    res.status(401)
    res.send('Unauthorized')
  } else {
    try {
      const pool = await getConnection()
      await pool
        .request()
        .input('userId', sql.Int, authRequest.user)
        .input('accountId', sql.Int, accountId)
        .input('amount', sql.Float, Math.round(amount * 100) / 100)
        .input('creationDate', sql.DateTime, new Date())
        .query(queries.newInvestment)

      res.json({ msg: 'Investment created.' })
    } catch (err) {
      res.json(err)
    }
  }
}
