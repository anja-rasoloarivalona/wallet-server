import Sequelize from 'sequelize'
import sequelize from './sequelize.js'

const Goal = sequelize.define(
    'goal',
    {
        goal_id: {
            type: Sequelize.STRING(32),
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.STRING(32),
            references: "user",
            referencesKey: "id",
            allowNull: false,
            primaryKey: true
        },
        amount: {
            type: Sequelize.DECIMAL(16, 2),
            allowNull: false
        },
        per_month: {
            type: Sequelize.DECIMAL(16, 2),
            allowNull: false
        }
    },
    {   
        timestamps: false,
        tableName: 'Goal',
        underscored: true
    }
)

export {
    Goal
}