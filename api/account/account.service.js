import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'
import { socketService } from '../../services/socket.service.js';
import { encryptPassword, decryptPassword } from '../auth/auth.service.js';

import { MongoClient, ObjectId } from 'mongodb';
const mongoId = ObjectId.createFromHexString;



const collectionName = 'account'

async function query(filterBy = { txt: '', type: '' }, loggedInUser) {

    try {


        const criteria = {
            ownerId: loggedInUser._id
        }

        if (filterBy.txt) {
            const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
            criteria.$or = [
                {
                    accountTitle: txtCriteria
                },
                {
                    notes: txtCriteria
                }
            ]
        }
        if (filterBy.type && filterBy.type !== 'all') {
            criteria.type = filterBy.type
        }

        const collection = await dbService.getCollection(collectionName)
        // getting minimal fields for the list
        var accounts = await collection.find(criteria).project({ history: false, passwordHash: false, username: false }).toArray()
        const types = accounts.reduce((acc, account) => {

            acc[account.type] = acc[account.type] ? acc[account.type] + 1 : 1

            return acc
        }, {})


        socketService.emitToUser({ type: 'account-types', data: types, userId: loggedInUser._id })

        return accounts
    } catch (err) {
        logger.error('cannot find accounts', err)
        throw err
    }
}

async function getById(accountId) {
    
    try {
        const collection = await dbService.getCollection(collectionName)
        accountId = mongoId(accountId)
        const account = await collection.findOne({ _id: accountId })
        // account.createdAt = ObjectId(account._id).getTimestamp()
        account.password = decryptPassword(account.passwordHash)
        delete account.passwordHash
        return account
    } catch (err) {
        logger.error(`while finding account ${accountId}`, err)
        throw err
    }
}

async function remove(accountId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        accountId = mongoId(accountId)
        await collection.deleteOne({ _id: accountId })
        return accountId
    } catch (err) {
        logger.error(`cannot remove account ${accountId}`, err)
        throw err
    }
}

async function add(account) {

    try {

        account.passwordHash = encryptPassword(account.password)
        const collection = await dbService.getCollection(collectionName)
        await collection.insertOne(account)
        return account
    } catch (err) {
        logger.error('cannot insert account', err)
        throw err
    }
}

async function update(account) {
    try {

        account.passwordHash = encryptPassword(account.password)
        console.log('account:', account);


        const collection = await dbService.getCollection(collectionName)
        const accountToSave = { ...account }
        // _id field is immutable
        delete accountToSave._id
        await collection.updateOne({ _id: mongoId(account._id) }, { $set: accountToSave })
        return account
    } catch (err) {
        logger.error(`cannot update account ${account._id}`, err)
        throw err
    }
}

async function addCarMsg(accountId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: ObjectId(accountId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add account msg ${accountId}`, err)
        throw err
    }
}

async function removeCarMsg(accountId, msgId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: ObjectId(accountId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add account msg ${accountId}`, err)
        throw err
    }
}

export const accountService = {
    remove,
    query,
    getById,
    add,
    update,
    addCarMsg,
    removeCarMsg
}
