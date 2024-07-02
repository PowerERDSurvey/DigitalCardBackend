const cardImageRepo = require("../config/businessCardImages");

let cardImageModel = { 
    createByCardId: async function (inputparam,type,card) {
        const returnVal = await cardImageRepo.createByCardId(inputparam,type,card);
        return returnVal;
    },
    getCardImageByCardId: async function(card){
        const returnVal =  await cardImageRepo.getCardimageById(card);
        return returnVal;
    },
    getAllCardImageByCardId: async function(card){
        const returnVal =  await cardImageRepo.getALLCardimageById(card);
        return returnVal;
    }
}

module.exports = cardImageModel;