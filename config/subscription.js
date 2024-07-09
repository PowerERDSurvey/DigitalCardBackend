const { update, random } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var subscriptionModel = require('../models/subscription')(sequelize, DataTypes);
let subscription = {
    createSubscription: async function(inputparam){
        const returnVal = await subscriptionModel.create(inputparam);
        return returnVal;
    },
    updateSubscription: async function(inputparam, SubscriptionId){
        // var query = {
        //     inputparam,
        //     where:{
        //         id:SubscriptionId
        //     }
        // }

        const update = await subscriptionModel.update(inputparam,
            {where:{
                id:SubscriptionId
            }});
        return await this.getOneSubscriptionById(SubscriptionId);
    },
    getOneSubscriptionById:async function(SubscriptionId){
        var condition = {
            where:{
                id:SubscriptionId,
                isDelete: false
            }
        }

        return await subscriptionModel.findOne(condition);
    },
    getAllSubscription:async function(){
        var condition = {
            where:{
                isDelete: false
            }
        }

        return await subscriptionModel.findOne(condition);
    },
    deleteSubscription:async function(userId, SubscriptionId){

        return await subscriptionModel.update({isDelete:true, updatedBy : userId}
          , { where:{
                id: SubscriptionId
            }});
    },
}

module.exports = subscription;