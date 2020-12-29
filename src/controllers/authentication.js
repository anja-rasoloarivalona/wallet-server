import ev from 'express-validator';
import isEmail from 'validator/lib/isEmail.js';
import { generateId } from '../utilities/index.js'
import { User, Access, Settings, Budget, Asset, Category, BudgetCategory } from '../models/index.js'
import { generateHashedPassword, checkPassword, checkEmail , generateToken, generateActivationLink, verifySignature, verifyToken } from '../services/authServices.js'
import { sendActivationLink } from '../services/emailService.js'
import Sequelize from 'sequelize'

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
            console.log('Failed to create user', err.message)
            return res.error(err, text_signup_failed, 422)
        }
    }
    console.log('errors', errors)
    return res.error(errors, text_signup_failed, 500)
}

const login = async(req, res) => {
    const errors = ev.validationResult(req);
    if(errors.isEmpty()){
        try {
            const credentials = req.body;
            const user = await User.findOne({
                where: {
                    email: credentials.email,
                    password: {
                        [Sequelize.Op.ne]: null
                    }
                },
                attributes: ['id', 'username', 'password', 'email'],
                include: [
                    {
                        model: Settings,
                        attributes: ["currency"],
                        nested: true
                    },
                    {
                        model: Budget,
                        attributes: ["sub_id", "amount", "used", "period"],
                        nested: true
                    },
                    {
                        model: Asset,
                        attributes: ["type", "name", "amount"],
                        nested: true
                    }
                ]
            });
            if(user !== null){
                const passwordIsValid = checkPassword(credentials.password, user.password)
                if(passwordIsValid){
                    const token = await generateToken(user);
                    if(token){
                        const { id, username, email, assets, budgets, setting } = user
                        return res.success({
                            user: {
                                id,
                                token,
                                username, 
                                email,
                                assets
                            },
                            budgets,
                            setting
                        }, 'Login successful', 200);
                    }
                    
                }
            }
        } catch(err){
            console.log(err.message)
            return res.error(err.message, 'Failed to login', 500)
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

            if(access){
                const responseData = await User.findOne({
                    where: {
                        id: access.user_id
                    },
                    attributes: ['id', 'username', 'email'],
                    include: [
                        {
                            model: Budget,
                            attributes: ["sub_id", "amount", "used", "period"],
                            include: [
                                {
                                    model: Category,
                                    attributes: ["master_name", "sub_name"],
                                    raw: true
                                }
                            ],
                            
                        },
                        {
                            model: Settings,
                            attributes: ["currency"],
                        },
                        {
                            model: Asset,
                            attributes: ["type", "name", "amount"],
                        }
                    ],
                })
    
                return res.success(responseData, 'Activation account successful', 201);
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

export {
    signup,
    login,
    activateAccount,
    verifyUserToken,
    logout
}