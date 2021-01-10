import ev from 'express-validator';
import { generateId } from '../utilities/index.js'
import { Transaction, Budget, Asset } from '../models/index.js'
import { setDate } from '../utilities/index.js'
import { getUser } from '../services/userService.js'

const editTransaction = async (req, res) => {
    const errors = ev.validationResult(req);
    if(errors.isEmpty){
        try {
            const { body : data, user_id } = req
            const prevTransaction = await Transaction.findOne({  where: { id: data.id } })
            const prevPeriod = setDate(prevTransaction.date, "mm-yyyy", "en")
            const prevAmount = parseInt(prevTransaction.amount)
            const transactionId = prevTransaction.id
            const asset = await  Asset.findOne({ where: { id: prevTransaction.asset_id } })


            await Transaction.destroy({  where: { id: transactionId }})
           
            const updatedAssetAmount = prevTransaction.type === "income" ? asset.amount - prevAmount: asset.amount + prevAmount
            await Asset.update({ amount: updatedAssetAmount },{
                    where: {
                        id: prevTransaction.asset_id
                    }
            })

            if(prevTransaction.type === "expense"){
                const budget = await Budget.findOne({ user_id, sub_id: prevTransaction.sub_id, period: prevPeriod}) 
                if(budget){
                    const updatedBudgetused = budget.used - prevAmount
                    await Budget.update( { used: updatedBudgetused } ,{
                            where: {
                                user_id, sub_id: prevTransaction.sub_id, period: prevPeriod
                            }
                        })
                }
            }
       
            return addTransaction(req, res)

        } catch(err){
            console.log(err.message)
        }
    }
}


const addTransaction = async (req, res) => {
    const errors = ev.validationResult(req);
    if(errors.isEmpty()){
        try {
            const  { body : data, user_id } = req
            const { sub_id, asset_id, date, amount, counterparty, type } = data
            const period = setDate( new Date(date), "mm-yy", "en")
            const id = data.id  ?  data.id   : generateId()

            await Transaction.upsert({
                id,
                user_id,
                sub_id,
                asset_id,
                date,
                amount,
                counterparty,
                type,

            })

            const usedAsset = await Asset.findOne({
                where: {
                    id: asset_id,
                    user_id
                }
            })

            if(!usedAsset){
                return res.error(["No asset found"], 'Failed to add transaction', 404)
            }
            const updatedAmount = type === "income" ? parseInt(usedAsset.amount)  + parseInt(amount) : parseInt(usedAsset.amount ) - parseInt(amount) 

            console.log(updatedAmount)
            
            await Asset.update(
                {
                    amount: updatedAmount
                },
                {
                    where: {
                        id: asset_id,
                        user_id,
                    }
                }
            )
            
            const usedBudget = await Budget.findOne({
                where: {
                    user_id,
                    sub_id,
                    period
                }
            })

            if(usedBudget){
                const updatedUsed = usedBudget.used + amount
                await Budget.update({
                        used: updatedUsed
                    }, {
                            where: {
                                user_id,
                                sub_id,
                                period
                            }
                        }
                    )
            }

            const user = await getUser(user_id)

            return res.success(user, 'Add transaction successful', 201);

        } catch(err){
            console.log(err.message)
            return res.error(err.message, 'Failed to add transaction', 500)
        }
    }
    console.log(errors)
    return res.error(errors, 'Failed to add transaction', 500)

}

export {
    addTransaction,
    editTransaction
}