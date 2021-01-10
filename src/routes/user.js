import express from 'express'
import ev from 'express-validator'

import {
    getChangePasswordSignature,
    changePassword
} from '../controllers/user.js'

const user = express.Router()

user.get(
    '/change-password-signature',
    [
        ev.check('password').notEmpty()
    ],
    getChangePasswordSignature
)

user.post(
    '/change-password',
    [
        ev.check('password').notEmpty(),
        ev.check('signature').notEmpty() 
    ],
    changePassword
)

export default user