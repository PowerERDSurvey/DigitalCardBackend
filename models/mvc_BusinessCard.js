const cardRepo = require("../config/businesscard");
let cardModel = { 
    createcreateCard: async function(inputparam){
        const returnVal = await cardRepo.createCard(inputparam) ;
        return returnVal;
    },
    updateCard:async function(inputparam, cardId){
        const returnVal = await cardRepo.updateCard(inputparam, cardId) ;
        return returnVal;
    },
    getALLCardbyUserId : async function(userId){
        const returnVal = await cardRepo.getALLCardbyUserId(userId) ;
        return returnVal;
    },
    getACardbyCardId:async function(userId,cardId){
        const returnVal = await cardRepo.getACardbyCardId(userId,cardId);
        return returnVal;
    },
    getACard:async function(cardId){
        const returnVal = await cardRepo.getACard(cardId);
        return returnVal;
    }
}

module.exports = cardModel;