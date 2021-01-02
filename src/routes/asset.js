import express from 'express'
import ev from 'express-validator'
import {
    addAsset,
    updateAsset,
} from '../controllers/asset.js'


const asset = express.Router()

asset.post(
    "/",
    [
        ev.check('type').notEmpty(),
        ev.check('name').notEmpty(),
        ev.check('amount').notEmpty(),
    ],
    addAsset
)

asset.put(
    "/",
    [
        ev.check('id').notEmpty(),
        ev.check('name').notEmpty(),
        ev.check('amount').notEmpty(),
    ],
    updateAsset
)

export default asset