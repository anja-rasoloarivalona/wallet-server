import ev from 'express-validator';
import { Budget, Category } from '../models/index.js'
import { getUser } from '../services/userService.js'

const addBudget = async(req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty){
        try {
            const { body : data, user_id } = req
            const existingBudget = await Budget.findOne({
                where: {
                    user_id,
                    sub_id: data.sub_id,
                    period: data.period
                }
            })
            if(existingBudget){
                return res.error([], "This budget already exists", 401)
            }
            await Budget.create({
                user_id,
                ...data,
                used: 0
            })
            const newBudget = await Budget.findOne({
                where: {
                    user_id,
                    sub_id: data.sub_id,
                    period: data.period
                }
            })

            if(newBudget){
                const user = await getUser(user_id)
                return res.success(user, 'Add budget successful', 201);
            } 
            return res.error(errors, "Did not find inserted budget", 404)

        } catch(err){
            return res.error(err.message, "Catched", 500)
        }
    }
    console.log('errors', errors)
    return res.error(errors, "Failed to add budget", 500)
}

const updateBudget = async(req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty){
        try {
            const { body : data, user_id } = req
            const existingBudget = await Budget.findOne({
                where: {
                    user_id,
                    sub_id: data.sub_id,
                    period: data.period
                }
            })
            if(!existingBudget){
                return res.error([], "This budget doesnt exist", 404)
            }
            await Budget.upsert({
                user_id,
                ...data,
            })

            const updatedBudget = await Budget.findOne({
                where: {
                    user_id,
                    sub_id: data.sub_id,
                    period: data.period
                }
            })

            if(updatedBudget){
                const user = await getUser(user_id)
                return res.success(user, 'Edit budget successful', 201);
            } 
            return res.error(errors, "Did not find updated budget", 404)

        } catch(err){
            return res.error(err.message, "Catched", 500)
        }
    }
    console.log('errors', errors)
    return res.error(errors, "Failed to add budget", 500)
}

const deleteBudget = async(req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty){
        try {
            const { body : data, user_id } = req
            await Budget.destroy({
                where: {
                    user_id,
                    sub_id: data.sub_id,
                    period: data.period
                }
            })
            const destroyed = await Budget.findOne({
                where: {
                    user_id,
                    sub_id: data.sub_id,
                    period: data.period
                }
            })
            if(destroyed){
                return res.error([], "Destroying budget failed", 404)
            }
            return res.success([], 'Delete budget successful', 201);

        } catch(err){
            return res.error(err.message, "Catched", 500)
        }
    }
    console.log('errors', errors)
    return res.error(errors, "Failed to add budget", 500)
}

export {
    addBudget,
    updateBudget,
    deleteBudget
}