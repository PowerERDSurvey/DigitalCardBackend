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
    
            getUsertokenById: async function (userId,verificationCode) {
                return await userRepo.getUsertokenById(userId,verificationCode);
            }
}

module.exports = userModel;