import ev from 'express-validator';
import { Asset, Budget, Settings } from '../models/index.js'
import { generateId } from '../utilities/index.js'

const initSetup = async (req, res) => {
    const errors = ev.validationResult(req)
    const failed_error = "setup_failed"

    if(errors.isEmpty()){
        try {
            const { body: { currency, assets, budget }, user_id } = req

            const responseData = {
                budget: [],
                assets: []
            }
            await Settings.upsert({
                user_id,
                currency: JSON.stringify(currency)
            })

            if(budget && budget.length > 0){
                await Promise.all(budget.map(async (item) => {
                    await Budget.upsert({
                        user_id,
                        ...item
                    })                
                }));
            }
            if(assets && assets.length > 0){
                await Promise.all(assets.map(async (item) => {
                    await Asset.upsert({
                        id: generateId(),
                        user_id,
                        ...item
                    })                
                }));
            }
            return res.success(responseData, 'Setup account successful', 201);

        } catch(error){
            console.log(error.message)
            return res.error(error.message, 'Failed to setup account', 500)
        }
    }
    console.log('errors', errors)
    return res.error(errors, failed_error, 500)
}

export {
    initSetup
}