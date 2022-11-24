import { Router } from 'express'
import { newInvestment } from '../controllers/investments.controller'
const router = Router()

router.post('/transactions/investments/new', newInvestment)

export default router
