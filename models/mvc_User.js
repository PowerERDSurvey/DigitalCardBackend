const userRepo = require("../config/user");

let userModel = { 
    create: function(inputParams,cb){
                userRepo.create(inputParams,cb);
            },
            getActiveEmails: function(inputParams,cb){
                userRepo.getActiveEmails(inputParams,cb);
            },
            update: function(UserId,inputParams,cb){
                userRepo.update(UserId,inputParams,cb);
            },
            getActivePassword: function(inputParams,cb){
                userRepo.getActivePassword(inputParams,cb);
            },
            getOneUser: function(inputParams,cb){
                userRepo.getOneUser(inputParams,cb);
            },
            getUser: async function(inputParams){
             return  await userRepo.getUser(inputParams);
            },
    
            getUsertokenById: async function (userId,verificationCode) {
                return await userRepo.getUsertokenById(userId,verificationCode);
            },
    
            getSuperAdmin: async function (userId) {
                return await userRepo.getSuperAdmin(userId);
            },
            getUserByRole: async function (role) {
                return await userRepo.getUserByRole(role);
            },

            deleteUser: async function (userId) {
                return await userRepo.deleteUser(userId);
            },

}

module.exports = userModel;