import Sequelize from 'sequelize'
import sequelize from './index.js'

const Asset = sequelize.define(
    'asset',
    {
        id: {
            type: Sequelize.STRING(32),
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.STRING(32),
            // field: "user_id",
            references: "user",
            referencesKey: "id",
            allowNull: false
        },
        type: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(255),
        },
        amount: {
            type: Sequelize.DECIMAL(16, 2),
            allowNull: false
        },
    },
    {   
        timestamps: false,
        tableName: 'Asset'
    }
)

export {
    Asset
}