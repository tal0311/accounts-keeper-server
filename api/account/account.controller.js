import { accountService } from './account.service.js'
import { logger } from '../../services/logger.service.js'

export async function getAccounts(req, res) {
  try {
    logger.debug('Getting Accounts:', req.query)
    const filterBy = {
      txt: req.query.txt || '',
      type: req.query.type || ''
    }

    const {loggedInUser}= req

    
    const accounts = await accountService.query(filterBy, loggedInUser)

    res.json(accounts)


  } catch (err) {
    logger.error('Failed to get accounts', err)
    res.status(400).send({ err: 'Failed to get accounts' })
  }
}

export async function getAccountById(req, res) {
  try {
    const accountId = req.params.id
    const account = await accountService.getById(accountId)
    res.json(account)
  } catch (err) {
    logger.error('Failed to get account', err)
    res.status(400).send({ err: 'Failed to get account' })
  }
}

export async function addAccount(req, res) {
  const { loggedInUser } = req

  try {
    const account = req.body
    account.ownerId = loggedInUser._id
    console.log('account:', account);
    const addedAccount = await accountService.add(account)
    res.json(account)
  } catch (err) {
    logger.error('Failed to add account', err)
    res.status(400).send({ err: 'Failed to add account' })
  }
}


export async function updateAccount(req, res) {
  try {
    const account = req.body
    const updatedAccount = await accountService.update(account)
    res.json(updatedAccount)
  } catch (err) {
    logger.error('Failed to update account', err)
    res.status(400).send({ err: 'Failed to update account' })

  }
}

export async function removeAccount(req, res) {
  try {
    const accountId = req.params.id
    const { loggedInUser } = req

    const account= await accountService.getById(accountId)
    

    if (loggedInUser._id !== account.ownerId) {
      return res.status(401).send('Not Authenticated')
    }
    const removedId = await accountService.remove(accountId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove account', err)
    res.status(400).send({ err: 'Failed to remove account' })
  }
}

export async function addAccountMsg(req, res) {
  const { loggedInUser } = req
  try {
    const accountId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedInUser
    }
    const savedMsg = await accountService.addAccountMsg(accountId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update account', err)
    res.status(400).send({ err: 'Failed to update account' })

  }
}

export async function removeAccountMsg(req, res) {
  const { loggedInUser } = req
  try {
    const accountId = req.params.id
    const { msgId } = req.params

    const removedId = await accountService.removeAccountMsg(accountId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove account msg', err)
    res.status(400).send({ err: 'Failed to remove account msg' })

  }
}


