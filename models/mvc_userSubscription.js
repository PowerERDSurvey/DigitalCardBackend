const userSubscriptionRepo = require("../config/userSubscription");

let userSubscriptionModel = {
    getuserSubscriptionById: async function(userSubscriptionId){
        return await userSubscriptionRepo.getUserSubscriptionById(userSubscriptionId);
    },
    createuserSubscription: async function(inputparam){
        return await userSubscriptionRepo.createUserSubscription(inputparam);
    },
    updateuserSubscription: async function(inputparam,userSubscriptionId){
        return await userSubscriptionRepo.updateUserSubscription(inputparam,userSubscriptionId);
    },
    getAllUserSubscriptionByQuery: async function(query){
        return await userSubscriptionRepo.getAllUserSubscriptionByQuery(query);
    },
 }


module.exports = userSubscriptionModel;