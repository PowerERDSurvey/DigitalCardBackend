const companyRepo = require("../config/company");

let companyModel = {
    createCompany: async function (inputparam, transaction) {
        return await companyRepo.createCompany(inputparam, transaction);
    },
    updateCompany: async function (inputparam, companyId, transaction) {
        return await companyRepo.updateCompany(inputparam, companyId, transaction);
    },
    get_All_ActiveCompanyById: async function (transaction) {
        return await companyRepo.get_All_ActiveCompanyById(transaction);
    },
    getActiveCompanyById: async function (compId, transaction) {
        return await companyRepo.getActiveCompanyById(compId, transaction);
    },
    activateOrDeactivate: async function (companyId, is_active, userId, transaction) {
        return await companyRepo.activateOrDeactivate(companyId, is_active, userId, transaction);
    },
    deleteCompany: async function (companyId, transaction) {
        return await companyRepo.deleteCompany(companyId, transaction);
    },
}

module.exports = companyModel;