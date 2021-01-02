import express from 'express'
import ev from 'express-validator'
import {
    addBudget,
    updateBudget,
    deleteBudget
} from '../controllers/budget.js'


const budget = express.Router()

budget.post(
    "/",
    [
        ev.check('sub_id').notEmpty(),
        ev.check('amount').notEmpty(),
        ev.check('period').notEmpty(),
    ],
    addBudget
)


budget.put(
    "/",
    [
        ev.check('sub_id').notEmpty(),
        ev.check('amount').notEmpty(),
        ev.check('period').notEmpty(),
    ],
    updateBudget
)

budget.delete(
    "/",
    [
        ev.check('sub_id').notEmpty(),
        ev.check('period').notEmpty(),
    ],
    deleteBudget
)


export default budget