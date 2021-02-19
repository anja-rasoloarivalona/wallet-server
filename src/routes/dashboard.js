import express from 'express'
import ev from 'express-validator'
import {
    getDashboard,
    addLayout,
    updateLayout
} from '../controllers/dashboard.js'

const dashboard = express.Router()

dashboard.get(
    "/",
    [],
    getDashboard
)

dashboard.post(
    "/",
    [
        ev.check("size").notEmpty(),
        ev.check("data").notEmpty()
    ],
    addLayout
)

dashboard.put(
    "/",
    [
        ev.check("size").notEmpty(),
        ev.check("data").notEmpty()
    ],
    updateLayout
)

export default dashboard