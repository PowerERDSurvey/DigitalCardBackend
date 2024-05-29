const userRepo = require("../config/user");

let userModel = { 
    create: function(inputParams,cb){
                userRepo.create(inputParams,cb);
            },
            getActiveEmails: function(inputParams,cb){
                userRepo.getActiveEmails(inputParams,cb);
            },
            update: function(inputParams,cb){
                userRepo.update(inputParams,cb);
            }
    

}

module.exports = userModel;