import { Access } from './access.js'
import { Asset } from './asset.js'
import { Budget } from './budget.js'
import { Category } from './category.js'
import { Settings } from './settings.js'
import { Transaction } from './transaction.js'
import { User } from './user.js'
import sequelize from "./sequelize.js"
import Sequelize from 'sequelize'





User.hasOne(Access, {
    foreingKey: "user_id",
    sourceKey: "id"
})

User.hasOne(Settings, {
    foreingKey: "user_id",
    sourceKey: "id",
})




User.hasMany(Budget, {
    foreingKey: "user_id",
    sourceKey: "id"
})

Budget.belongsTo(User, {
    foreingKey: "id",
    sourceKey: "user_id" 
})


User.hasMany(Asset, {
    foreingKey: "user_id",
    sourceKey: "id"
})

Asset.belongsTo(User, {
    foreingKey: "id",
    sourceKey: "user_id" 
})

// Budget.hasOne(Category, {
//     targetKey: "sub_id"
// })



const BudgetCategory = sequelize.define("budget_category", {
    sub_id: {
        type: Sequelize.STRING(32),
        primaryKey: true,
        allowNull: false
    }
}, {timeStamps: false, underscored: true})


Budget.belongsTo(Category, {
    foreignKey: "sub_id",
})

// Category.hasMany(Budget, {
//     foreingKey: "sub_id",
//     sourceKey: "sub_id"
// })


// Category.belongsToMany(Budget, { through: BudgetCategory, foreingKey: "sub_id", targetKey: "sub_id" });
// Budget.hasOne(BudgetCategory, {
//     foreingKey: "sub_id",
//     sourceKey: "sub_id"
// })


// Budget.hasOne(BudgetCategory)




// Budget.belongsToMany(Category, { through: BudgetCategory, foreignKey: 'sub_id' });


// Budget.hasMany(BudgetCategory)
// Category.hasMany(BudgetCategory)

// BudgetCategory.belongsTo(Budget)
// Category.belongsTo(BudgetCategory)




// Category.belongsToMany(Budget, {
//     through: BudgetCategory,
//     // unique_key: "sub_id"
// })



// Category.belongsToMany(Budget, {
//     through: "sub_id",
// })


// User.hasMany(Transaction, {
//     foreingKey: "user_id",
//     sourceKey: "id"
// })

// Transaction.belongsTo(User, {
//     foreingKey: "id",
//     sourceKey: "user_id" 
// })


export {
    Access,
    Asset,
    Budget,
    Category,
    BudgetCategory,
    Settings,
    Transaction,
    User
}