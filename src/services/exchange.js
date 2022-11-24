import { config } from 'dotenv'
const axios = require('axios');

config()

export const getExchangeRates = async (originCurrency, destinyCurrency) => {
  let baseCurrency = destinyCurrency == 'USD' ? '' : `&base_currency=${destinyCurrency}`
  let options = {
    'method': 'GET',
    'url': `${process.env.CURRENCY_API_URL}apikey=${process.env.CURRENCY_API_KEY}&currencies=${originCurrency}${baseCurrency}`,
  }

  const result = await axios(options)
  return result
}
