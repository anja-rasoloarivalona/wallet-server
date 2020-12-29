import ev from 'express-validator';
import { Category } from '../models/index.js'

const getCategories = async(req, res) => {
    const errors = ev.validationResult(req)
 
    if(errors.isEmpty()){
        console.log('getting categories')
        try {
            const categories = await Category.findAll()
            console.log("success")
            return res.success(categories, 'Get categories succeeded', 200)
        } catch (error){
            console.log(error.message)
            return res.error(error.message, 'Failed to get categories', 500)
        }
    }
    return res.error(errors, 'Failed to get categories', 500)
}

export {
    getCategories
}