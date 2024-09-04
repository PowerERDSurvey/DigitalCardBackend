const { update, random } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var Layout = require('../models/layout')(sequelize, DataTypes);

let layout = {
    createLayout: async function (inputparam, transaction) {
        return await Layout.create(inputparam, { transaction });
    },
    updateLayout: async function (inputparam, layoutId, transaction) {
        await Layout.update(inputparam, {
            where: { id: layoutId },
            transaction
        });
        return this.getLayout(layoutId, transaction);
    },
    getLayout: async function (layoutId, transaction) {
        return await Layout.findOne({
            where: { id: layoutId },
            transaction
        });
    },
    getAllLayout: async function (transaction) {
        return await Layout.findAll({ transaction });
    },
    activateOrDeactivate: async function (layoutId, is_active, transaction) {
        return await Layout.update(
            { isActive: is_active },
            {
                where: { id: layoutId },
                transaction
            }
        );
    },
}

module.exports = layout;
