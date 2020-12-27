import express from 'express'
import ev from 'express-validator'
import {
    signup,
    activateAccount
} from '../controllers/authentication.js'

const authentication = express.Router()
const regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]{8,}/;

authentication.post(
    '/signup',
    [
        ev.check('email').isEmail().notEmpty(),
        ev.check('username').notEmpty(),
        ev.check('password').notEmpty()
    ],
    signup
)

authentication.post(
    '/signup/activate-account',
    [
        ev.check('signature').notEmpty(),
        ev.check('userId').notEmpty()
    ],
    activateAccount
)

export default authentication