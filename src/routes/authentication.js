import express from 'express'
import ev from 'express-validator'
import {
    signup,
    logout,
    login,
    activateAccount,
    verifyUserToken
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
    '/login',
    [ev.check('email').notEmpty(), ev.check('password').notEmpty()],
    login
);


authentication.post(
    '/logout', [], logout
)



authentication.post(
    '/signup/activate-account',
    [
        ev.check('signature').notEmpty(),
        ev.check('userId').notEmpty()
    ],
    activateAccount
)

authentication.post(
    '/verify-user-token',
    [
        ev.check('token').notEmpty()
    ],
    verifyUserToken
)

export default authentication