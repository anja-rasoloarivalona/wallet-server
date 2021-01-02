import ev from 'express-validator';
import { Asset } from '../models/index.js'
import { getUser } from '../services/userService.js'
import { generateId } from '../utilities/index.js'

const addAsset = async (req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty){
        try {
            const { body : data, user_id } = req
            const id = generateId()
            await Asset.create({
                id,
                user_id,
                type: data.type,
                name: data.name,
                admount: data.amount
            })
            const newAsset = await Asset.findOne({
                where: {
                    user_id,
                    id
                }
            })

            if(newAsset){
                const user = await getUser(user_id)
                return res.success(user, 'Add asset successful', 201);
            } 
            return res.error(errors, "Did not find inserted asset", 404)

        } catch(err){
            return res.error(err.message, "Catched", 500)
        }
    }
    console.log('errors', errors)
    return res.error(errors, "Failed to add asset", 500)
}


const updateAsset = async (req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty){
        try {
            const { body : data, user_id } = req
            const existingAsset = await Asset.findOne({
                where: {
                    id: data.id,
                    user_id,
                }
            })

            if(!existingAsset){
                return res.error([], "This asset doesnt exist", 404)
            }

            await Asset.update({
                name: data.name,
                amount: data.amount
            }, {
                where: {
                    id: data.id,
                    user_id,
                }
            })
            const user = await getUser(user_id)
            return res.success(user, 'edit asset successful', 201);

        } catch(err){
            return res.error(err.message, "Catched", 500)
        }
    }
    console.log('errors', errors)
    return res.error(errors, "Failed to add asset", 500)
}

export {
    addAsset,
    updateAsset
}