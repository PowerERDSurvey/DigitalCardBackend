
const userImageRepo = require("../config/userImage");

let userImageModel = { 
    createByUserId: async function (inputparam,type,user) {
        const returnVal = await userImageRepo.createByUserId(inputparam,type,user);
        return returnVal;
    },
    getUserImageByUserId: async function(user){
        const returnVal =  await userImageRepo.getUserimageById(user);
        return returnVal;
    },
    getAllUserImageByUserId: async function(user){
        const returnVal =  await userImageRepo.getALLUserimageById(user);
        return returnVal;
    }
}

module.exports = userImageModel;