const { update } = require('lodash');
const fs = require('fs');
const {sequelize ,DataTypes} = require('../config/sequelize');
var BusinessCard = require('../models/businesscard')(sequelize, DataTypes);
var User = require('../models/user')(sequelize, DataTypes);

let businessCard = {
    createCard : async function(inputparam){
        const returnVal = await BusinessCard.create(inputparam);
        return returnVal;

    },
    updateCard : async function(inputparam, cardId){
        const returnVal =await  BusinessCard.update(
            inputparam,
            {
                where: {
                    id: cardId
                },
                returning: true,
            }
        );
        return returnVal;
        
    },
    getALLCardbyUserId: async function(userid){
        const returnVal = await BusinessCard.findAll({where:{userId: userid, isActive:true}});
        return returnVal;
    },
    getACardbyCardId: async function(userKey, cardKey){
        const userid = await User.findOne({where:{randomKey:userKey, isActive:true}});
        if (!userid) return  userid;
        const returnVal = await BusinessCard.findOne({where:{randomKey:cardKey, isActive:true, userId :userid.id}})
        return returnVal;
    }
}

module.exports = businessCard;