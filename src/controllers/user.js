import ev from 'express-validator';
import { Asset, Budget, Settings, User, Access, Goal } from "../models/index.js"
import { checkPassword, generateChangePasswordToken, generateSignature, generateHashedPassword, verifySignature } from '../services/authServices.js'
import { generateId } from '../utilities/index.js'

const getChangePasswordSignature = async (req, res) => {
    const errors = ev.validationResult(req)

    if(errors.isEmpty()){
        try {
            const { password } = req.query
            const user = await User.findOne({
                where: {
                    id: req.user_id
                }
            })
            const passwordIsValid = checkPassword(password, user.password)
            if(!passwordIsValid){
                return res.error("Wrong credentials", 'Failed to generate change password token', 401)
            }
            const changePasswordToken = await generateChangePasswordToken(user)
            const signature = generateSignature(changePasswordToken)

            return res.success(signature, "Password is valid", 200)

        } catch(err){
            console.log('err', err.message)
        }

    } else {
        console.log("errors", errors)
        return res.error(errors, 'Failed to generate change password signature', 500)
    }
}

const changePassword = async (req, res) => {
    const errors = ev.validationResult(req)

    if(errors.isEmpty()){
        try {
            const  { password, signature } = req.body
            const change_password_token = verifySignature(signature)

            const access = await Access.findOne({
                where: {
                    change_password_token
                }
            })

            if(!access){
                return res.error("No access found, invalid signature", 'Failed to change password', 500)
            }
            const hashedPassword = await generateHashedPassword(password)

            User
                .update(
                    {
                        password: hashedPassword,
                    },
                    {
                        where: {
                            id: req.user_id
                        }
                    })
                .then(() => {
                    Access.update(
                        {
                            change_password_token: null,
                            token: null
                        },
                        {
                            where: {
                                user_id: req.user_id
                            }
                        }
                    )
                    .then(() => {
                        return res.success([], "Change password successfull", 201)
                    })
                    .catch(err => {
                        return res.error(err, "Change password successfull but failed to get rid of tokens in access", 500)
                    })         
                })
                .catch(err => {
                    console.log("failed change password", err)
                    return res.error(err, "Change password unsuccessfull", 401)
                })

        } catch(err){
            console.log('err', err.message)
            return res.error( err.message, 'Catch change password', 500)
        }
    } else {
        console.log("errors", errors)
        return res.error(errors, 'Failed to change password', 500)
    }
}

const addGoal = async(req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty()){
        try {
            const { body: data } = req
            const { amount, per_month} = data
            const goal_id = generateId()
            await Goal.create({
                user_id: req.user_id,
                goal_id,
                amount, 
                per_month
            })
            const createdGoal = await Goal.findOne({
                where: {
                    goal_id
                }
            })
            if(!createdGoal){
                return res.error("Something went wrong", 'Failed to retrieve goal', 503)
            }   
            return res.success(createdGoal, "Goal added succesfully", 200)
        } catch(err){
            return res.error(err, 'Failed to set goal', 500)
        }
    }

    return res.error(errors, 'Failed to set goal', 500)
}

export {
    changePassword,
    getChangePasswordSignature,
    addGoal
}