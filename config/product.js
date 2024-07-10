const { update, random } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var productModel = require('../models/product')(sequelize, DataTypes);
var layoutModel = require('../models/layout')(sequelize, DataTypes);
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

        
        const productz = await productModel.findOne(condition);

        var layoutIds = productz.layoutId.split(',').map(Number);

        // Fetch the layouts
        const layouts = await layoutModel.findAll({
            where: {
                id: layoutIds
            }
        });

        // Combine product data with layouts data
        var productData = productz.dataValues;
        var layoutData = layouts.map(layout => layout.dataValues);

        // Construct the return value
        var returnVal = {
            ...productData,
            layouts: layoutData
        };

        return returnVal;


    
    },
    getAllProduct:async function(){
        var condition = {
            where:{
                isDelete: false
            }
        }

        return await productModel.findAll(condition);
    },
    deleteProduct:async function(userId, productId){

        return await productModel.update({isDelete:true, updatedBy : userId}
          , { where:{
                id: productId
            }});
    },
}

module.exports = product;