import { Router } from 'express'
import { newTopup } from '../controllers/topups.controller'
const router = Router()

router.get('/transactions/topup/new', newTopup)

export default router
