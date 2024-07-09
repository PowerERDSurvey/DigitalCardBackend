const { update, random } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var productModel = require('../models/product')(sequelize, DataTypes);
let product = {
    createProduct: async function(inputparam){
        const returnVal = await productModel.create(inputparam);
        return returnVal;
    },
    updateProduct: async function(inputparam, productId){
        // var query = {
        //     inputparam,
        //     where:{
        //         id:productId
        //     }
        // }

        const update = await productModel.update(inputparam,
            {where:{
                id:productId
            }});
        return await this.getOneProductById(productId);
    },
    getOneProductById:async function(productId){
        var condition = {
            where:{
                id:productId,
                isDelete: false
            }
        }

        return await productModel.findOne(condition);
    },
    getAllProduct:async function(){
        var condition = {
            where:{
                isDelete: false
            }
        }

        return await productModel.findOne(condition);
    },
    deleteProduct:async function(productId){

        return await productModel.update({isDelete:true}
          , { where:{
                id: productId
            }});
    },
}

module.exports = product;