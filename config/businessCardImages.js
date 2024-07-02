const { update } = require('lodash');
const fs = require('fs');
const {sequelize ,DataTypes} = require('../config/sequelize');
var BusinessCardImages = require('../models/businesscardimage')(sequelize, DataTypes);

let businessCardImages = {
    createByCardId: async function (inputparam,Itype,card ) {
        var createCardImage={};
        const fileData = fs.readFileSync(inputparam.path);
        const fileBlob = Buffer.from(fileData, 'binary');
        try {
            const getCardImage = await this.getCardImageByIdandType(card,Itype);
    
            if (!getCardImage) {
                createCardImage =await  BusinessCardImages.create({
                    filename: inputparam.filename,
                    filepath: inputparam.path,
                      type: Itype,
                      cardId: card,
                      data:fileBlob,
                })
            }
            else{
                createCardImage = await BusinessCardImages.update({
                    filename: inputparam.filename,
                    filepath: inputparam.path,
                    data:fileBlob,
                }, {
                    where: {
                        cardId: getCardImage.cardId,
                        type: getCardImage.type
                    },
                    returning: true,
                });
            }
        
            const reurnVal = await this.getCardImageByIdandType(card,Itype);
                return reurnVal;
            
        } catch (error) {
            throw new Error('Image upload failed: ' + error.message);
        }
       
        
    },
    getCardimageById: async function (card) {
        const getCardImage = await BusinessCardImages.findOne({where:{cardId: card}});
        return getCardImage;
    },
    getALLCardimageById: async function (card) {
        const getCardImage = await BusinessCardImages.findAll({where:{cardId: card}});
        return getCardImage;
    },
    getCardImageByIdandType:async function (card, Itype) {
        const returnVal = await BusinessCardImages.findOne({ where: { cardId: card, type: Itype} });
        return returnVal;
    }
}


module.exports =businessCardImages;



