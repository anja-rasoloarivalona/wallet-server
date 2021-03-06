import Sequelize from 'sequelize';
import sequelize from './sequelize.js'

const User = sequelize.define(
    'user',
    {
        id: {
            type: Sequelize.STRING(32),
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING(64),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        createdAt: {
            type: 'TIMESTAMP',
            field: 'created_at',
            defaultValue:  Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: 'TIMESTAMP',
            field: 'updated_at',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
    },
    {   
        timestamps: false,
        tableName: 'User'
    }
)

export {
    User
}