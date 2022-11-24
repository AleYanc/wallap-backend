import { Router } from 'express'
import { getAllUsers, addNewUser, getUser, deleteUser, logIn, userAccounts, userTransactions } from "../controllers/users.controller";

const router = Router()

router.get('/users', getAllUsers)

router.get('/users/:id', getUser)

router.get('/users/:id/accounts', userAccounts)

router.get('/users/:id/transactions', userTransactions)

router.post('/login', logIn)

router.post('/users', addNewUser)

router.delete('/users/:id', deleteUser)

export default router
