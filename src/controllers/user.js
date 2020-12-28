import ev from 'express-validator';
import { Asset, Budget, Settings, User, Access } from "../models/index.js"

const getUser = async (req, res) => {
    const errors = ev.validationResult(req)
    const failed_error = "Failed to get user"

    if(errors.isEmpty()){
        try {
            const { user_id } = req
            
            User.findOne({
                where: {
                    id: user_id
                },
                attributes: ['username', 'email'],
                include: [
                    {
                        model: Settings,
                        as: "settings",
                        attributes: ["currency"],
                        nested: true
                    }
                ]
            })
            .then(response => {
                console.log('response', response)
            })


        } catch(err){
            console.log('err', err.message)
        }

    }
}

export {
    getUser
}