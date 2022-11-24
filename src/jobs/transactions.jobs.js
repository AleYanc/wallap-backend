import {
  getConnection,
  queries
}
  from "../database";

const schedule = require('node-schedule');

const executeTransferTransactions = async () => {
  const pool = await getConnection()
  await pool
    .request()
    .query(queries.executeMoneyTransfers)
}

const startInvestmentsTransactions = async () => {
  const pool = await getConnection()
  await pool.request().query(queries.startInvestments)
}

const executeInvestmentsTransactions = async () => {
  const pool = await getConnection()
  await pool.request().query(queries.executeInvestments)
}

const deleteFailedInvestments = async () => {
  const pool = await getConnection()
  await pool.request().query(queries.failedInvestments)
}

export const executeTransactionJobs = () => {
  // Initialize money transfer transactions (Pending => Completed)
  schedule.scheduleJob("*/5 * * * * *", async () => await executeTransferTransactions())

  // Initialize investments transactions (Created => Ongoing)
  schedule.scheduleJob("*/5 * * * * *", async () => await startInvestmentsTransactions())

  // Update account balance based on expected profit every 4 days (0.02%)
  schedule.scheduleJob("* * * */4 * *", async () => await executeInvestmentsTransactions())

  // Delete failed records
  schedule.scheduleJob("* * */2 * * *", async () => await deleteFailedInvestments())
}




