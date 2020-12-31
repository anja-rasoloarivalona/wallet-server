import ev from 'express-validator';
import { Settings } from '../models/index.js'


const setDashboard = async (req, res) => {
    const errors = ev.validationResult(req)

    if(errors.isEmpty()){
        const { data } = req.body
        const newSettings =JSON.stringify(data)
        const res = await Settings.upsert({
            user_id: req.user_id,
            dashboard: newSettings
        })
        if(res){
            return res.success([], 'Update dashboard successfull', 201);
        }
        return res.error(errors, "Failed to update dashboard settings", 500)
    }

    console.log('errors', errors)
    return res.error(errors, "Failed to update dashboard settings", 500)
}

export {
    setDashboard
}