import express from 'express'
import middleware from '../middlewares/index.js'
import authentication from './authentication.js'
import categories from './categories.js'
const routes = express.Router()

routes.use(middleware.cors)
routes.use(middleware.response)
routes.use("/", authentication)
routes.use("/categories", categories)



export default routes