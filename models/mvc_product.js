const productRepo = require("../config/product");
let productModel = {
    createProduct: async function(inputparam){
        return await productRepo.createProduct(inputparam);
    },
    updateProduct: async function(inputparam, productId){
        return await productRepo.updateProduct(inputparam, productId);
    },
    getOneProductById:async function(productId){
        return await productRepo.getOneProductById(productId);
    },
    getAllProduct:async function(){
        return await productRepo.getAllProduct();
    },
    deleteProduct:async function(productId){
        return await productRepo.deleteProduct(productId);
    },
 }

module.exports = productModel;

