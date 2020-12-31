import Sequelize from 'sequelize'
import sequelize from './sequelize.js'
///

const Settings = sequelize.define(
    'settings',
    {
        user_id: {
            type: Sequelize.STRING(32),
            references: "user",
            referencesKey: "id",
            allowNull: false,
            primaryKey: true
        },
        currency: {
            type: Sequelize.STRING(255)
        },
        dashboard: {
            type: Sequelize.STRING(2550),
            defautValue: null
        }
    },
    {   
        timestamps: false,
        tableName: 'settings',
        underscored: true
    }
)

export {
    Settings
}