const companyRepo = require("../config/company");
let companyModel = {
    createCompany: async function(inputparam){
        const returnVal = await companyRepo.createCompany(inputparam) ;
        return returnVal;
    },
    updateCompany: async function(inputparam,companyId){
        const returnVal = await companyRepo.updateCompany(inputparam,companyId) ;
        return returnVal;
    },
    get_All_ActiveCompanyById: async function(){
        const returnVal = await companyRepo.get_All_ActiveCompanyById() ;
        return returnVal;
    },
    getActiveCompanyById: async function(compId){
        const returnVal = await companyRepo.getActiveCompanyById(compId) ;
        return returnVal;
    },
    activateOrDeactivate: async function(companyId, is_active, userId){
        const returnVal = await companyRepo.activateOrDeactivate(companyId, is_active, userId) ;
        return returnVal;
    },
    deleteCompany: async function(companyId){
        const returnVal = await companyRepo.deleteCompany(companyId) ;
        return returnVal;
    },

}

module.exports = companyModel;