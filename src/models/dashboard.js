import Sequelize from 'sequelize'
import sequelize from './sequelize.js'

const Dashboard = sequelize.define(
    'dashboard',
    {
        user_id: {
            type: Sequelize.CHAR(32),
            references: "user",
            referencesKey: "id",
            allowNull: false,
            primaryKey: true
        },
        size: {
            type: Sequelize.CHAR(3),
            allowNull: false,
            primaryKey: true
        },
        data: {
            type: Sequelize.STRING(1234),
            allowNull: false
        }
    },
    {   
        modelName: "dashboard",
        timestamps: false,
        tableName: 'Dashboard',
        underscored: true
    }
)

export {
    Dashboard
}