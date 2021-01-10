import bcrypt from 'bcrypt'
import { User } from '../models/user.js'
import { Access } from '../models/access.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const secret = process.env.APP_SECRET_KEY
const tokenExpiration = process.env.TOKEN_EXPIRATION
const encryptionAlgorithm = 'aes-256-cbc'

const generateHashedPassword = async password => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS)
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

const checkPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

const checkEmail = async email => {
    const user = await User.findOne({
        where: {
            email: email
        }
    })
    if(user){
        return true
    }
    return false
}

const verifyToken = params => {
    if (params) {
        const [bearer, token] = params.split(' ');
        if (bearer && token) {
            const jwtVerified = jwt.verify(token, secret, (err, decoded) => {
                return !err ? decoded : false;
            });
            return jwtVerified;
        }
    }
    return false;
}

const generateToken = async user => {
    const { id, username } = user
    const token = jwt.sign(
        {
            data: {
                id,
                username
            }
        },
        secret,
        {
            expiresIn: tokenExpiration
        }
    )

    const generatedToken = Access.upsert({
        user_id: id,
        token
    }).then(function(test){
        return test
    })

    return generatedToken ? token : false
}

const generateChangePasswordToken = async user => {
    const { id, username } = user
    const token = jwt.sign(
        {
            data: {
                id,
                username
            }
        },
        secret,
        {
            expiresIn: tokenExpiration
        }
    )

    const generatedToken = Access.upsert({
        user_id: id,
        change_password_token: token
    }).then(function(test){
        return test
    })

    return generatedToken ? token : false
}

const generateSignature = token => {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(encryptionAlgorithm, secret, iv)
    const encrypted = Buffer.concat([cipher.update(token), cipher.final()])
    return `${iv.toString('hex')}_${encrypted.toString('hex')}`
}

const verifySignature = signature => {
    const [iv, encrypted] = signature.split('_')
    const decipher = crypto.createDecipheriv(encryptionAlgorithm, secret, Buffer.from(iv, 'hex'))
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]).toString()
    return decrypted
    
}

const generateActivationLink = (token, id) => {
    const APP_URL = process.env.APP_FRONT_END_URL
    const signature = generateSignature(token)
    console.log('signature', signature)

    return `${APP_URL}/signup/activate?id=${id}&signature=${signature}`
}


export {
    checkEmail,
    generateHashedPassword,
    checkPassword,
    generateActivationLink,
    generateToken,
    generateChangePasswordToken,
    verifyToken,
    verifySignature,
    generateSignature
}