import ev from 'express-validator';
import { Settings } from '../models/index.js'


const setDashboard = async (req, res) => {
    const errors = ev.validationResult(req)

    if(errors.isEmpty()){
        try {
            const { data } = req.body
            const newSettings =JSON.stringify(data)

            await Settings.update({
                dashboard: newSettings
            }, {
                where: {
                    user_id: req.user_id,
                }
            })

            const settings = await Settings.findOne({
                where: { user_id: req.user_id },
                attributes: ["dashboard"]
            })

            if(settings){
                return res.success(settings, 'Update dashboard successfull', 201);    
            }
            return res.error([], "No settings found", 404)  

        } catch(err){
            return res.error(err.message, "Catch", 500)
        }
  
    }
    return res.error(errors, "Failed to update dashboard settings", 500)
}

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

    console.log({errors})

    return res.error(errors, "Failed to update currency", 500)
}

export {
    setDashboard,
    setCurrency
}