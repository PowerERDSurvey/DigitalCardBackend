const currencyConfig = require("../config/currencyconversionrate");
let currencyModel = {
    getallCurrency: async function () {
        const returnVal = await currencyConfig.getallCurrency();
        return returnVal;
    },
    createCurrency: async function (inputparam) {
        const returnVal = await currencyConfig.createCurrency(inputparam);
        return returnVal;
    },
    updateCurrency: async function (updateparam, id) {
        const returnVal = await currencyConfig.updateCurrency(updateparam, id);
        return returnVal;
    },
    // deleteCurrency: async function (id) {
    //     const returnVal = await currencyConfig.getStatebyCountry(id);
    //     return returnVal;
    // },
}

module.exports = currencyModel;