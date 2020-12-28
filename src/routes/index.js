import express from 'express'
import middleware from '../middlewares/index.js'
import authentication from './authentication.js'
import categories from './categories.js'
import user from './user.js'
import setup from './setup.js'


const routes = express.Router()

routes.use(middleware.cors)
routes.use(middleware.response)
routes.use("/", authentication)
routes.use("/categories", categories)
routes.use("/", middleware.authMiddleware)
routes.use("/setup", setup)
routes.use("/user", user)


export default routes