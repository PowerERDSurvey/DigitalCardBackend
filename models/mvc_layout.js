const layoutRepo = require("../config/company");
let layoutModel = {
    createLayout: async function(inputparam){
        const returnVal = await layoutRepo.createLayout(inputparam) ;
        return returnVal;
    },
    updateLayout: async function(inputparam,layoutId){
        const returnVal = await layoutRepo.updateLayout(inputparam,layoutId) ;
        return returnVal;
    },
    getLayout: async function(layoutId){
        const returnVal = await layoutRepo.getLayout(layoutId) ;
        return returnVal;
    },
    getAllLayout: async function(){
        const returnVal = await layoutRepo.getAllLayout() ;
        return returnVal;
    },
    activateOrDeactivate: async function(layoutId, is_active){
        const returnVal = await layoutRepo.activateOrDeactivate(layoutId, is_active) ;
        return returnVal;
    },
}

module.exports = layoutModel;

