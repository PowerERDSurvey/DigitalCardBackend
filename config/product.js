const { update, random } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var productModel = require('../models/product')(sequelize, DataTypes);
var layoutModel = require('../models/layout')(sequelize, DataTypes);
let product = {
    createProduct: async function (inputparam) {
        const returnVal = await productModel.create(inputparam);
        return returnVal;
    },
    updateProduct: async function (inputparam, productId) {
        // var query = {
        //     inputparam,
        //     where:{
        //         id:productId
        //     }
        // }

        const update = await productModel.update(inputparam,
            {
                where: {
                    id: productId
                }
            });
        return await this.getOneProductById(productId);
    },
    getOneProductById: async function (productId) {
        var condition = {
            where: {
                id: productId,
                isDelete: false
            }
        }

        const productz = await productModel.findOne(condition);


        const layoutIdString = productz.layoutId.replace(/^"(.*)"$/, '$1');
        const layoutIdArray = await this.parseLayoutIdArray(layoutIdString);
        const layoutIds = layoutIdArray.map(item => item.id);
        // Fetch the layouts
        const layoutDetails = await layoutModel.findAll({
            where: {
                id: layoutIds
            }
        });

        // Combine product data with layouts data
        var productData = productz.dataValues;
        var layoutData = layoutDetails.map(layout => layout.dataValues);

        // Construct the return value
        var returnVal = {
            ...productData,
            layouts: layoutIdArray,
            layoutDetails: layoutData
        };

        return returnVal;
    },
    getAllProduct: async function (plantype) {
        var condition = {
            where: {
                isDelete: false,
            }
        }
        if (plantype) {
            condition.where.plantype = plantype;
        }

        return await productModel.findAll(condition);
    },
    deleteProduct: async function (userId, productId) {

        return await productModel.update({ isDelete: true, updatedBy: userId }
            , {
                where: {
                    id: productId
                }
            });
    },
    parseLayoutIdArray: async function (str) {
        if (!str || str === '[]') return [];
        return str.slice(1, -1).split('},{').map(item => {
            const [id, price] = item.split(',');
            return {
                id: parseInt(id.split(':')[1]),
                price: parseFloat(price.split(':')[1])
            };
        });
    }
}

module.exports = product;