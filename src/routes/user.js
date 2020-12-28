import express from 'express'
import ev from 'express-validator'

import {
    getUser,
} from '../controllers/user.js'

const user = express.Router()

user.get(
    "/",
    [],
    getUser
)

export default user