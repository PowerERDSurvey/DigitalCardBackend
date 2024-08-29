const cardRepo = require("../config/businesscard");

let cardModel = {
    createCard: async function (inputparam, transaction) {
        return await cardRepo.createCard(inputparam, transaction);
    },
    updateCard: async function (inputparam, cardId, transaction) {
        return await cardRepo.updateCard(inputparam, cardId, transaction);
    },
    getALLCardbyUserId: async function (userId, transaction) {
        const returnVal = await cardRepo.getALLCardbyUserId(userId);
        return returnVal;
    },
    getALLActiveCardbyUserId: async function (userId, transaction) {
        const returnVal = await cardRepo.getALLActiveCardbyUserId(userId);
        return returnVal;
    },
    getACardbyCardId: async function (userId, cardId, transaction) {
        const returnVal = await cardRepo.getACardbyCardId(userId, cardId);
        return returnVal;
    },
    getACard: async function (cardId, transaction) {
        const returnVal = await cardRepo.getACard(cardId);
        return returnVal;
    }
}

module.exports = cardModel;