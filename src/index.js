import app from './app'
import { executeTransactionJobs } from './jobs/transactions.jobs'

app.listen(
  app.get('port'),
  () => console.log(`Server listening on port ${app.get('port')}`)
)

executeTransactionJobs()
