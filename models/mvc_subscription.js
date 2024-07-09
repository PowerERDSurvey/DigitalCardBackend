const SubscriptionRepo = require("../config/subscription");
let SubscriptionModel = {
    createSubscription: async function(inputparam){
        return await SubscriptionRepo.createSubscription(inputparam);
    },
    updateSubscription: async function(inputparam, SubscriptionId){
        return await SubscriptionRepo.updateSubscription(inputparam, SubscriptionId);
    },
    getOneSubscriptionById:async function(SubscriptionId){
        return await SubscriptionRepo.getOneSubscriptionById(SubscriptionId);
    },
    getAllSubscription:async function(){
        return await SubscriptionRepo.getAllSubscription();
    },
    deleteSubscription:async function(userId,SubscriptionId){
        return await SubscriptionRepo.deleteSubscription(userId,SubscriptionId);
    },
 }

module.exports = SubscriptionModel;
