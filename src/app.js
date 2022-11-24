import express from 'express'
import config from './config'

//Routes
import usersRoutes from './routes/users.routes'
import accountRoutes from './routes/accounts.routes'
import moneyTransferRoutes from './routes/moneytransfer.routes'
import investmentsRoutes from './routes/investments.routes'
import topUpRoutes from './routes/topups.routes'

const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Settings
app.set('port', config.port)
app.use('/api/v1', usersRoutes)
app.use('/api/v1', accountRoutes)
app.use('/api/v1', moneyTransferRoutes)
app.use('/api/v1', investmentsRoutes)
app.use('/api/v1', topUpRoutes)

export default app
