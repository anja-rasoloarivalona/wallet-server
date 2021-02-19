import { Access } from './access.js'
import { Asset } from './asset.js'
import { Budget } from './budget.js'
import { Category } from './category.js'
import { Settings } from './settings.js'
import { Transaction } from './transaction.js'
import { User } from './user.js'
import { Goal } from './goal.js'
import { Dashboard } from './dashboard.js'
import sequelize from "./sequelize.js"
import Sequelize from 'sequelize'






User.hasOne(Access, {
    // foreignKey: "user_id",
    sourceKey: "id"
})

User.hasOne(Settings, {
    // foreignKey: "user_id",
    sourceKey: "id",
})

User.hasOne(Goal, {
    sourceKey: "id",
    foreignKey: "user_id"
})

Goal.belongsTo(User, {
    sourceKey: "user_id" 
})



User.hasMany(Budget, {
    // foreignKey: "user_id",
    sourceKey: "id"
})

Budget.belongsTo(User, {
    // foreignKey: "id",
    sourceKey: "user_id" 
})

// Goal.belongsTo(User, {
//     sourceKey: "user_id" 
// })


User.hasMany(Asset, {
    // foreignKey: "user_id",
    sourceKey: "id"
})

Asset.belongsTo(User, {
    // foreignKey: "id",
    sourceKey: "user_id" 
})


Budget.belongsTo(Category, {
    foreignKey: "sub_id",
})


User.hasMany(Transaction, {
    foreignKey: "user_id",
    sourceKey: "id"
})

// Transaction.belongsTo(User, {
//     foreignKey: "user_id",
//     sourceKey: "id"
// })


Transaction.belongsTo(Category, {
    foreignKey: "sub_id",
})

Transaction.belongsTo(Asset, {
    foreignKey: "asset_id",
    sourceKey: "id"
})



export {
    Access,
    Asset,
    Budget,
    Category,
    Settings,
    Transaction,
    User,
    Goal,
    Dashboard
}