import express from 'express'
import ev from 'express-validator'
import {
    setDashboard,
    setCurrency
} from '../controllers/settings.js'


const settings = express.Router()

settings.post(
    '/dashboard',
    [
        ev.check('data').notEmpty()
    ],
    setDashboard
)

settings.post(
    '/currency',
    [
        ev.check('currency').notEmpty()
    ],
    setCurrency
)
export default settings