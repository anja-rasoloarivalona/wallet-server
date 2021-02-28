import Sequelize from 'sequelize';
import sequelize from './sequelize.js'

const Category = sequelize.define(
    'categories',
    {   
        sub_id: {
            type: Sequelize.STRING(32),
            fied: "sub_id",
            allowNull: false,
            primaryKey: true,
        },
        master_id: {
            type: Sequelize.STRING(32),
            allowNull: false
        },
        master_name: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        master_icon: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        sub_name: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        sub_icon: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        color: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        type: {
            type: Sequelize.ENUM("income", "expense")
        }
    },
    {   
        timestamps: false,
        tableName: 'categories',
        underscored: true
    }
)

export {
    Category
}