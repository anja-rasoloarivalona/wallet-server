import { User } from '../models/index.js'
import {  verifyToken } from '../services/authServices.js'

async function authMiddleware(req, res, next) {
    console.log(req.get('Authorization'))
    const decoded = await verifyToken(req.get('Authorization'));

    if (decoded) {
        const { id, username } = decoded.data;

        const user = await User.findOne({
            where: {
                id,
                username
            }
        });
        if (user) {
            req.user_id = user.id
            return next();
        }
    }

    console.log({decoded})

    return res.error([], 'Unauthorized', 401);
}

export default authMiddleware;