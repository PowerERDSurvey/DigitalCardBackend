const { sequelize, DataTypes } = require('./sequelize');
const currencyModel = require('../models/currencyconversionrate')(sequelize, DataTypes);

let currencyConfig = {
    getallCurrency: async function () {
        const returnVal = await currencyModel.findAll();
        return returnVal;

    },
    createCurrency: async function (inputparam) {
        const returnVal = await currencyModel.create(inputparam);
        return returnVal;

    },
    updateCurrency: async function (updateparam, id) {
        const returnVal = await currencyModel.update(updateparam, { where: { id: id } });
        return returnVal;

    },


}

module.exports = currencyConfig;