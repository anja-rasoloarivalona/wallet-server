import express from 'express'
import ev from 'express-validator'
import {
    setCurrency
} from '../controllers/settings.js'


const settings = express.Router()

settings.post(
    '/currency',
    [
        ev.check('currency').notEmpty()
    ],
    setCurrency
)
export default settings