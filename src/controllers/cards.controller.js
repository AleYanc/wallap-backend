import e from "cors";
import {
  getConnection,
  sql,
  queries
}
  from "../database";
import { testCreditCard } from "../helpers/cards/card_validation"
import { authorizeRequest } from "../middleware/auth"

export const newCardd = async (req, res) => {
  let authRequest = await authorizeRequest(req)

  const { cardNumber, cardCvv, cardType, alias } = req.body

  const encryptCard = await bcrypt.hash(cardNumber, 16)
  const encryptCvv = await bcrypt.hash(cardCvv, 16)

  if (testCreditCard(cardNumber, cardCvv).valid == false) {
    res.json({ msg: 'Invalid card' })
    return false
  }

  if (authRequest.valid == false) {
    res.json({ msg: 'Unauthorized' })
  } else {
    try {
      const pool = await getConnection()
      await pool
        .request()
        .input('cardNumber', sql.Int, encryptCard)
        .input('cardCvv', sql.Int, encryptCvv)
        .input('cardType', sql.VarChar, cardType)
        .input('userId', authRequest.user)
        .input('active', sql.Bit, 1)
        .input('alias', sql.VarChar, alias)
        .query()

    } catch (err) {
      res.json(err)
    }
  }
}
