import { Router } from 'express'
import { newTransfer } from '../controllers/moneytransfer.controller'
const router = Router()

router.post('/transactions/moneytransfer', newTransfer)

export default router
