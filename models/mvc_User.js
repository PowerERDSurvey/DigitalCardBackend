const userRepo = require("../config/user");

let userModel = { 
    create:async function(inputParams){
               return await  userRepo.create(inputParams);
            },
            getActiveEmails: async function(inputParams){
                return await userRepo.getActiveEmails(inputParams);
            },
            update: async function(UserId,inputParams){
                return await userRepo.update(UserId,inputParams);
            },
            getActivePassword: async function(inputParams){
                return await userRepo.getActivePassword(inputParams);
            },
            getOneUser: async function(inputParams){
                return await userRepo.getOneUser(inputParams);
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
            getCompanybasedUser: async function (companyId,role) {
                return await userRepo.getCompanybasedUser(companyId,role);
            },

            deleteUser: async function (adminId,userId) {
                return await userRepo.deleteUser(adminId,userId);
            },

}

module.exports = userModel;