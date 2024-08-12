const paymentConfig = require("../config/payment");

let paymentModel = {
    updatepayment: async function (inputParam, id) {
        return await paymentConfig.updatepayment(inputParam, id)
    },
    getallpayment: async function () {
        return await paymentConfig.getallpayment();
    },
    createpayment: async function (inputParam) {
        return await paymentConfig.createpayment(inputParam);
    },
    get_payment_by_userId: async function (userId) {
        return await paymentConfig.get_payment_by_userId(userId);
    }
}

module.exports = paymentModel;