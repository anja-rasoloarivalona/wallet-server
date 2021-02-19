import ev from 'express-validator';
import { Settings } from '../models/index.js'

const setCurrency = async (req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty()){
        try {
            const { currency } = req.body 
            
            await Settings.update({
                currency: JSON.stringify(currency)
            }, {
                where: {
                    user_id: req.user_id,
                }
            })
            const updatedCurrency = await Settings.findOne({
                where: { user_id: req.user_id },
                attributes: ["currency"]
            })

            if(updatedCurrency){
                return res.success(updatedCurrency, 'Update currency successfull', 201); 
            }

            return res.error([], "No settings found", 404)  

      
        } catch(err){
            console.log(err)
            return res.error(err.message, "Catch", 500)
        }
    }
    return res.error(errors, "Failed to update currency", 500)
}

export {
    setCurrency
}