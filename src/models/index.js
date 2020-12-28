import { Access } from './access.js'
import { Asset } from './asset.js'
import { Budget } from './budget.js'
import { Category } from './category.js'
import { Settings } from './settings.js'
import { Transaction } from './transaction.js'
import { User } from './user.js'

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
    Settings,
    Transaction,
    User
}