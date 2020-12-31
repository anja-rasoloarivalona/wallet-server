import { User, Budget, Category, Settings, Asset, Transaction } from '../models/index.js'
import Sequelize from 'sequelize'

const getUser = async (id, credentials) => {

    const whereAttributes = credentials ?
        {
            email: credentials.email,
            password: {
                [Sequelize.Op.ne]: null
            }
        } : { id }
        

    const responseData = await User.findOne({
        where: {
            ...whereAttributes
        },
        attributes: ['id', 'username', 'email', 'password'],
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
                model: Transaction,
                include: [
                    {
                        model: Category,
                        attributes: ["master_name", "sub_name", "sub_icon"]
                    },
                    {
                        model: Asset,
                    }
                ]
            },
            {
                model: Settings,
                attributes: ["currency"],
            },
            {
                model: Asset,
                attributes: ["id", "type", "name", "amount"],
            }
        ],
    })

    return responseData ? responseData : false
}

export {
    getUser
}