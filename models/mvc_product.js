const productRepo = require("../config/product");
let productModel = {
    createProduct: async function (inputparam) {
        return await productRepo.createProduct(inputparam);
    },
    updateProduct: async function (inputparam, productId) {
        return await productRepo.updateProduct(inputparam, productId);
    },
    getOneProductById: async function (productId) {
        return await productRepo.getOneProductById(productId);
    },
    getAllProduct: async function (plantype) {
        return await productRepo.getAllProduct(plantype);
    },
    deleteProduct: async function (userId, productId) {
        return await productRepo.deleteProduct(userId, productId);
    },
}

module.exports = productModel;

