const countryRepo = require("../config/countryAndState");
let countryModel = { 
    getallContries : async function(){
        const returnVal = await countryRepo.getallContries() ;
        return returnVal;
    },
    getStatebyCountry:async function(counrtyid){
        const returnVal = await countryRepo.getStatebyCountry(counrtyid);
        return returnVal;
    }
}

module.exports = countryModel;