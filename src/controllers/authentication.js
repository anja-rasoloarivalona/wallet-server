import ev from 'express-validator';
import isEmail from 'validator/lib/isEmail.js';
import { generateId } from '../utilities/index.js'
import { User } from '../models/user.js'
import { Access } from '../models/access.js'
import { generateHashedPassword, checkPassword, checkEmail , generateToken, generateActivationLink, verifyTokenOwner, verifySignature } from '../services/authServices.js'
import { sendActivationLink } from '../services/emailService.js'

const signup = async (req, res) => {
    const errors = ev.validationResult(req)
    const text_signup_failed = 'signup_failed'

  
    if(errors.isEmpty()){
        const { body : data } = req
        const { email, username, password } = data
        const existingUser = await checkEmail(email)
        if(existingUser){
            return res.error([], 'email_taken', 409)
        }
        try {
            const id = generateId()
            const hashedPassword = await generateHashedPassword(password)
            const user = await User.create({
                id,
                username,
                email,
                password: hashedPassword
            })
            if(!user){
                return res.error([], text_signup_failed, 500)
            }
            const token = await generateToken(user)
            const activationLink = generateActivationLink(token, id)
            await sendActivationLink(user, activationLink)
            return res.success(user, 'Signup successful', 201);
        } catch (err){
            console.log('Failed to create user', err)
            return res.error(err, text_signup_failed, 422)
        }
    }
    console.log('errors', errors)
    return res.error(errors, text_signup_failed, 500)
}

const activateAccount = async (req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty()){
        try {
            const { body : data } = req
            const { signature, userId } = data
            const token = verifySignature(signature)
            const tokenIsValid = await verifyTokenOwner(token, userId)
            if(!tokenIsValid){
                return res.error([], 'UNVALID TOKEN', 500)
            }
            await Access.upsert({
                userId,
                token,
                activated: true
            })
            return res.success(data, 'Activation account successful', 201);
        } catch(error){
            return res.error(error, 'Failed to activate account', 500)
        }

    }
    return res.error(errors, 'Failed to activate account', 500)
}

export {
    signup,
    activateAccount
}