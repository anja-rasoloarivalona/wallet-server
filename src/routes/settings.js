import express from 'express'
import ev from 'express-validator'
import {
    setDashboard
} from '../controllers/settings.js'


const settings = express.Router()

settings.post(
    '/dashboard',
    [
        ev.check('dashboard').notEmpty()
    ],
    setDashboard
)

export default settings