import ev from 'express-validator';
import { generateId } from '../utilities/index.js'
import { Dashboard } from '../models/index.js'

const getDashboard = async(req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty()){
        try {
            const { user_id } = req
            const dashboards = await Dashboard.findAll({
                where: { user_id }
            })
            return res.success(dashboards, "Get layout success", 200)
        } catch(err){
            return res.error(err, "Failed to add layout3", 500)
        }
    }
    return res.error(errors, "Failed to retrieve layout1", 500)
}


const addLayout = async (req, res) => {
    const errors = ev.validationResult(req)

    if(errors.isEmpty()){
        try {
            const { body , user_id } = req
            const { size, data } = body
            const dashboard = await Dashboard.create({
                user_id,
                size,
                data: JSON.stringify(data)
            })
            if(dashboard){
                return res.success(dashboard, 'Added layout', 201)
              
            }
            return res.error([], 'Failed to add layout2', 502)
        } catch(err){
            console.log({
                err
            })
            return res.error(err, "Failed to add layout3", 500)
        }
    }
    return res.error(errors, "Failed to add layout1", 500)
}

const updateLayout = async (req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty()){
        try {
            const { body , user_id } = req
            const { size, data } = body

            const dashboard = await Dashboard.findOne({
                where: {
                    user_id,
                    size
                }
            })

            const updatedDashboard =  await dashboard.update({
                data: JSON.stringify(data)
            })

            if(updatedDashboard){
                return res.success(updatedDashboard, 'Updated layout', 201)
            }
            return res.error([], 'Failed to update layout2', 502)
        } catch(err){
            return res.error(err, "Failed to update layout3", 500)
        }
    }
    return res.error(errors, "Failed to updated layout1", 500)
}

export {
    getDashboard, 
    addLayout,
    updateLayout
}