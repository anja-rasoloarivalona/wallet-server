import Sequelize from 'sequelize'
import sequelize from './index.js'

const Budget = sequelize.define(
    'budget',
    {
        user_id: {
            type: Sequelize.STRING(32),
            // field: "user_id",
            references: "user",
            referencesKey: "id",
            allowNull: false
        },
        sub_id: {
            type: Sequelize.STRING(32),
            // field: "user_id",
            references: "categories",
            referencesKey: "sub_id",
            allowNull: false
        },
        amount: {
            type: Sequelize.DECIMAL(16, 2),
            allowNull: false,
            defaultValue: 0
        },
        used: {
            type: Sequelize.DECIMAL(16, 2),
            allowNull: false,
            defaultValue: 0
        },
        period: {
            type: Sequelize.STRING(255)
        },

    },
    {   
        timestamps: false,
        tableName: 'Budget'
    }
)

export {
    Budget
}