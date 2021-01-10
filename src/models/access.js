import Sequelize from 'sequelize'
import sequelize from './sequelize.js'

const Access = sequelize.define(
    'access',
    {
        user_id: {
            type: Sequelize.STRING(32),
            references: "user",
            referencesKey: "id",
            primaryKey: true
        },
        token: {
            type: Sequelize.STRING(255),
            defaultValue: null
        },
        confirmation_email_token: {
            type: Sequelize.STRING(32),
            defaultValue: null
        },
        change_password_token: {
            type: Sequelize.STRING(255),
            defaultValue: null
        }
    },
    {
        timestamps: false,
        tableName: "Access",
        underscored: true
    }
)

export {
    Access
}