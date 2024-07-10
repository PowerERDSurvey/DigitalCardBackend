const { update } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var userSubscription = require('../models/usersubscription')(sequelize, DataTypes);



let user_subscription = {
    createUserSubscription: async function (inputparam){
        const returnval = await userSubscription.create(inputparam);
        return returnval;
    },
    updateUserSubscription: async function (inputparam, UserSubscriptionId){
        await userSubscription.update(inputparam,{where:{id:UserSubscriptionId}});
        return await this.getUserSubscriptionById(UserSubscriptionId);
    },
    getUserSubscriptionById: async function (UserSubscriptionId){
        return await userSubscription.findOne({where:{id:UserSubscriptionId}});
    },
    getAllUserSubscription: async function (){
        return await userSubscription.findAll();
    },
    getAllUserSubscriptionByQuery: async function (query){
        return await userSubscription.findAll(query);
    },
}


module.exports = user_subscription;