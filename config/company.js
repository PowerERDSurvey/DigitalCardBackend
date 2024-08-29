const { update, random } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var Company = require('../models/company')(sequelize, DataTypes);

let company = {
    createCompany: async function (inputparam, transaction) {
        return await Company.create(inputparam, { transaction });
    },
    updateCompany: async function (inputparam, companyId, transaction) {
        await Company.update(inputparam, {
            where: { id: companyId },
            transaction
        });
        return this.getActiveCompanyById(companyId, transaction);
    },
    getActiveCompanyById: async function (companyId, transaction) {
        return await Company.findOne({
            where: {
                id: companyId,
                isDelete: false,
            },
            transaction
        });
    },
    get_All_ActiveCompanyById: async function (transaction) {
        return await Company.findAll({
            where: { isDelete: false },
            transaction
        });
    },
    activateOrDeactivate: async function (companyId, is_active, userId, transaction) {
        return await Company.update(
            {
                isActive: is_active,
                updateBy: userId,
            },
            {
                where: { randomKey: companyId },
                transaction
            }
        );
    },
    deleteCompany: async function (companyId, transaction) {
        return await Company.update(
            { isDelete: true },
            {
                where: { id: companyId },
                returning: true,
                transaction
            }
        );
    }
}

module.exports = company;