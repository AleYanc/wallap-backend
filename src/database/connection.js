import sql from 'mssql'
import { config } from 'dotenv'
config()

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PSWD,
  server: process.env.SERVER_NAME,
  database: process.env.DB_NAME,
  trustServerCertificate: true
}

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings)
    return pool
  } catch (err) {
    console.log(err);
  }
}

export { sql };
