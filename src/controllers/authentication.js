import ev from 'express-validator';
import isEmail from 'validator/lib/isEmail.js';
import { generateId } from '../utilities/index.js'
import { User, Access, Settings, Budget, Asset, Category } from '../models/index.js'
import { generateHashedPassword, checkPassword, checkEmail , generateToken, generateActivationLink, verifySignature, verifyToken, generateResetPasswordLink, generateChangePasswordToken, generateSignature } from '../services/authServices.js'
import { sendActivationLink, sendResetPasswordLink } from '../services/emailService.js'
import { getUser } from '../services/userService.js'


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
            const emailSent = await sendActivationLink(user, activationLink)
            if(!emailSent){
                return res.error([], "Failed to send email", 502)
            }
            return res.success(user, 'Signup successful', 201);
        } catch (err){
            return res.error(err.message, text_signup_failed, 422)
        }
    }
    return res.error(errors, text_signup_failed, 500)
}

const login = async(req, res) => {
    const errors = ev.validationResult(req);
    if(errors.isEmpty()){
        try {
            const credentials = req.body;

            const user = await getUser(null, credentials)
            if(!user){
                return res.error("No user found", 'Failed to login', 404)
            }

            const passwordIsValid = checkPassword(credentials.password, user.password)
            if(!passwordIsValid){
                return res.error("Wrong credentials", 'Failed to login', 401)
            }

            const token = await generateToken(user);
            if(!token){
                return res.error("Failed to generate new token", 'Failed to login', 500)
            }
            const userData = await getUser(user.id)
            const loginResponse = {
                userData,
                token
            }
            return res.success(loginResponse, "Login successful", 200)

        } catch(err){
            console.log(err)
            console.log(err.message)
            return res.error(err.message, 'Failed to login', 501)
        }
    } else {
        console.log("errors", errors)
        return res.error(errors, 'Failed to login', 500)
    }

}

const activateAccount = async (req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty()){
        try {
            const { body : data } = req
            const { signature, userId } = data
            const token = verifySignature(signature)
            const access = await Access.findOne({
                where: {
                    token: token
                }
            })
            if(access.user_id !==  userId){
                return res.error([], 'UNVALID TOKEN', 500)
            }
            const etoken = generateId()

            await Access.upsert({
                user_id: userId,
                token,
                confirmation_email_token: etoken
            })

            const userData = await User.findOne({
                where: {
                    id: userId
                },
                attributes: ["username", "email"]
            })

            const user = {
                id: userId,
                token,
                username: userData.username,
                email: userData.email
            }

            return res.success(user, 'Activation account successful', 201);
        } catch(error){
            console.log(error.message)
            return res.error(error.message, 'Failed to activate account', 500)
        }

    }
    return res.error(errors, 'Failed to activate account', 500)
}

const verifyUserToken = async (req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty()){
        const { token } = req.body
        try {
            const access = await Access.findOne({
                where: {
                    token
                },
                attributes: ["user_id"]
            })
            if(access && access.user_id){
                const user = await getUser(access.user_id)
                return res.success(user, 'Activation account successful', 201);
            }
           
            return res.error(["loool"], 'Failed to verify token', 500)

        } catch(err){
            console.log(err.message)
            return res.error(err.message, 'Failed to verify token', 500)
        }
    }
    return res.error(errors, 'Failed to verify token', 500)

}

const logout = async (req, res) => {
    const errors = ev.validationResult(req);
    if(errors.isEmpty()){
        const decoded = await verifyToken(req.get('Authorization'))
        if(decoded){
            const { id: user_id } = decoded.data;
            await Access.upsert({
                user_id,
                token: null
            })
            return res.success([], 'Logout successful', 200);
        }
    }
    return res.validation(errors.array());
}

const forgotPassword = async (req, res) => {
    const errors = ev.validationResult(req)
      
    if(errors.isEmpty()){
        try {
            const { body : { email } } = req
            const user = await User.findOne({
                where: {
                    email: email
                }
            })
            if(!user){
                return res.error([], 'no user found', 404)
            }
            const token = generateId()

            await Access.update({
                reset_password_email_token: token
            }, {
                where: {
                    user_id: user.id
                }
            })
            const resetLink = generateResetPasswordLink(token, user.id)
            const emailSent = await sendResetPasswordLink(user, resetLink)
            if(!emailSent){
                return res.error([], "Failed to send email", 502)
            }
            return res.success([], 'Send email success', 201);

        } catch (err){
            return res.error(err, "Failed to send email for resetting password", 422)
        }
    }
    return res.error(errors, "Failed to send email for resetting password", 500)

}

const checkResetPasswordSignature = async (req, res) => {
    const errors = ev.validationResult(req)
    if(errors.isEmpty()){
        try {
            const { body : { signature, id } } = req
            const token = verifySignature(signature)

            const access = await Access.findOne({
                where: {
                    reset_password_email_token: token
                }
            })
            if(!access){
                return res.error("Invalid signature", 'No access found', 404)
            }

            if(access.user_id !== id){
                return res.error([], 'Invalid signature', 404)
            }

            const user = await User.findOne({
                where: {
                    id: access.user_id
                }
            })
            const changePasswordToken = await generateChangePasswordToken(user)
            const _signature = generateSignature(changePasswordToken)

            await Access.update({
                reset_password_email_token: null
            }, {
                where: {
                    user_id: user.id
                }
            })

            return res.success({signature: _signature}, 'Signature is valid', 201);

        } catch (err){
            console.log(err.message)
            return res.error(err, "Failed to generate reset password token", 422)
        }
    }
    return res.error(errors, "Invalid signature", 500)
}

const resetPassword = async(req, res) => {
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
                            id: access.user_id
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
                                user_id: access.user_id
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

export {
    signup,
    login,
    activateAccount,
    verifyUserToken,
    logout,
    forgotPassword,
    checkResetPasswordSignature,
    resetPassword
}