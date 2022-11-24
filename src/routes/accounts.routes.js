import { Router } from 'express'
import { addAccount, deleteAccount, getAccounts } from '../controllers/accounts.controller'
const router = Router()

router.get('/accounts', getAccounts)

router.post('/accounts', addAccount)

router.delete('/accounts/:id', deleteAccount)

export default router
