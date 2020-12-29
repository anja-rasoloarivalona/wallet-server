import Sequelize from 'sequelize'
import sequelize from './sequelize.js'
///

const Budget = sequelize.define(
    'budget',
    {   
        sub_id: {
            type: Sequelize.STRING(32),
            field: "sub_id",
            references: "categories",
            referencesKey: "sub_id",
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.STRING(32),
            field: "user_id",
            references: "user",
            referencesKey: "id",
            allowNull: false,
            primaryKey: true
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
        modelName: "budget",
        timestamps: false,
        tableName: 'Budget',
        underscored: true
    }
)

export {
    Budget
}