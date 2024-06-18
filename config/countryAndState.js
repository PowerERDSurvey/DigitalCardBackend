const { update } = require('lodash');
const fs = require('fs');
const {sequelize ,DataTypes} = require('./sequelize');
var countiesModel = require('../models/country')(sequelize, DataTypes);
var stateModel = require('../models/state')(sequelize, DataTypes);

let CountryConfig = {
    getallContries : async function(){
        const returnVal = await countiesModel.findAll();
        return returnVal;

    },
    getStatebyCountry : async function(counrtyId){
        const returnVal = await stateModel.findAll({where:{countryId:counrtyId}});
        return returnVal;

    },
}

module.exports =CountryConfig;