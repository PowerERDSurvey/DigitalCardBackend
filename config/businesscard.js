const { update } = require('lodash');
const fs = require('fs');
const { sequelize, DataTypes } = require('../config/sequelize');
var BusinessCard = require('../models/businesscard')(sequelize, DataTypes);
var User = require('../models/user')(sequelize, DataTypes);

let businessCard = {
    createCard: async function (inputparam, transaction) {
        return await BusinessCard.create(inputparam, { transaction });
    },
    updateCard: async function (inputparam, cardId, transaction) {
        const [numAffected, updatedCards] = await BusinessCard.update(
            inputparam,
            {
                where: { id: cardId },
                returning: true,
                transaction
            }
        );
        return updatedCards[0];
    },
    getALLCardbyUserId: async function (userid, transaction) {
        return await BusinessCard.findAll({
            where: { userId: userid, isDelete: false }
        });
    },
    getALLActiveCardbyUserId: async function (userid, transaction) {
        return await BusinessCard.findAll({
            where: { userId: userid, isActive: true, isDelete: false }
        });
    },
    getACardbyCardId: async function (userKey, cardKey, transaction) {
        const userid = await User.findOne({
            where: { randomKey: userKey, isActive: true }
        });
        if (!userid) return userid;
        return await BusinessCard.findOne({
            where: { randomKey: cardKey, isActive: true, isDelete: false, userId: userid.id }
        });
    },
    getACard: async function (cardId, transaction) {
        return await BusinessCard.findOne({
            where: { id: cardId, isDelete: false }
        });
    },
}

module.exports = businessCard;