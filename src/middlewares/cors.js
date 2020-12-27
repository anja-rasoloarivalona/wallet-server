import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const allowedOrigin = process.env.ALLOWED_ORIGIN

export default cors({
    origin: (origin, callback) => {
        // console.log('[CORS ORIGIN]', origin)
        if(allowedOrigin.includes(origin)){
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
})