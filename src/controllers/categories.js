import ev from 'express-validator';
import { Categorie } from '../models/category.js'


const getCategories = async(req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty()){
        try {
            const categories = await Categorie.findAll()
            return res.success(categories, 'Get categories succeeded', 200)
        } catch (error){
            return res.error(error.message, 'Failed to get categories', 500)
        }
    }
    return res.error(errors, 'Failed to get categories', 500)
}

export {
    getCategories
}