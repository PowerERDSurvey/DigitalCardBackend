const layoutRepo = require("../config/layout");

let layoutModel = {
    createLayout: async function (inputparam, transaction) {
        return await layoutRepo.createLayout(inputparam, transaction);
    },
    updateLayout: async function (inputparam, layoutId, transaction) {
        return await layoutRepo.updateLayout(inputparam, layoutId, transaction);
    },
    getLayout: async function (layoutId, transaction) {
        return await layoutRepo.getLayout(layoutId, transaction);
    },
    getAllLayout: async function (transaction) {
        return await layoutRepo.getAllLayout(transaction);
    },
    activateOrDeactivate: async function (layoutId, is_active, transaction) {
        return await layoutRepo.activateOrDeactivate(layoutId, is_active, transaction);
    },
}

module.exports = layoutModel;

