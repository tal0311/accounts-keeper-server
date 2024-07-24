import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getAccounts, getAccountById, addAccount, updateAccount, removeAccount, addAccountMsg, removeAccountMsg } from './account.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log,requireAuth, getAccounts)
router.get('/:id', getAccountById)
router.post('/', requireAuth, addAccount)
// router.put('/:id', requireAuth, updateAccount)
router.put('/:id',  updateAccount)
router.delete('/:id', requireAuth, removeAccount)
// router.delete('/:id', requireAuth, requireAdmin, removeAccount)

router.post('/:id/msg', requireAuth, addAccountMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeAccountMsg)

export const accountRoutes = router
