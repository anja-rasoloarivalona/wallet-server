import Sequelize from 'sequelize'
import sequelize from './index.js'

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
            allowNull: false
        },
        activated: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        timestamps: false,
        tableName: "Access"
    }
)

export {
    Access
}