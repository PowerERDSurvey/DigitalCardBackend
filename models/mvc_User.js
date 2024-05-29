const userRepo = require("../config/user");

let userModel = { 
    create: function(inputParams,cb){
                userRepo.create(inputParams,cb);
            }
}

module.exports = userModel;