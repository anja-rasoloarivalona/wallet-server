import Sequelize from 'sequelize'
import sequelize from './sequelize.js'

const Transaction = sequelize.define(
    'transaction',
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
        sub_id: {
            type: Sequelize.STRING(32),
            // field: "sub_id",
            references: "categories",
            referencesKey: "sub_id",
            allowNull: false
        },
        asset_id: {
            type: Sequelize.STRING(32),
            // field: "asset_i",
            references: "asset",
            referencesKey: "id"
        },
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        amount: {
            type: Sequelize.DECIMAL(16, 2),
            allowNull: false
        },
        type: {
            type: Sequelize.ENUM,
            values: ['expense', 'income'],
            allowNull: false
        },
        counterparty: {
            type: Sequelize.STRING(500),
        },


    },
    {   
        timestamps: false,
        tableName: 'Transaction',
        underscored: true
    }
)

export {
    Transaction
}