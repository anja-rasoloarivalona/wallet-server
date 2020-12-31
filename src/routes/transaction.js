import express from 'express'
import ev from 'express-validator'
import {
    addTransaction,
    editTransaction
} from '../controllers/transaction.js'


const transaction = express.Router()

transaction.post(
    '/add',
    [
        ev.check('sub_id').notEmpty(),
        ev.check('asset_id').notEmpty(),
        ev.check('date').notEmpty(),
        ev.check('amount').notEmpty(),
        ev.check('counterparty').notEmpty(),
        ev.check('type').notEmpty(),
    ],
    addTransaction
)

transaction.put(
    '/edit',
    [
        ev.check('id').notEmpty(),
        ev.check('sub_id').notEmpty(),
        ev.check('asset_id').notEmpty(),
        ev.check('date').notEmpty(),
        ev.check('amount').notEmpty(),
        ev.check('counterparty').notEmpty(),
        ev.check('type').notEmpty(),
    ],
    editTransaction
)

export default transaction