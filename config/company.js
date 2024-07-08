const { update, random } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var Company = require('../models/company')(sequelize, DataTypes);
let company = {
    createCompany: async function(inputparam){
        const returnVal = await Company.create(inputparam);
        return returnVal;

    },
    updateCompany: async function(inputparam, companyId){
        const updatedCompany = await Company.update(inputparam, {
            where: {
                id: companyId
            },
            returning: true,
        });
       const returnVal =  this.getActiveCompanyById(companyId);
        return returnVal;

    },
    getActiveCompanyById: async function(companyId){
        const returnVal = await Company.findOne({ where: {
            id: companyId,
            isActive:true
        },})
        return returnVal;
    },
    get_All_ActiveCompanyById: async function(){
        const returnVal = await Company.findAll({ where: {
            // id: companyId,
            isDelete:false,
        },})
        return returnVal;
    },
    activateOrDeactivate:async function(companyId, is_active, userId){
        const returnVal = await Company.update(
            {
                isActive: is_active,
                updateBy: userId,
              },
              {
                where: {
                  randomKey: companyId,
                },
              }
        )
        return returnVal;
    },
    deleteCompany: async function(companyId){
        const updatedCompany = await Company.update({isDelete : true },{
            where: {
                id: companyId
            },
            returning: true,
        });
        return updatedCompany;
    }

}
module.exports = company;