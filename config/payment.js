const { sequelize, DataTypes } = require('../config/sequelize');
const Payment = require('../models/payment')(sequelize, DataTypes);
let paymentConfig = {
    getallpayment: async function () {
        return await Payment.findAll();
    },
    get_payment_by_userId: async function (id) {
        return await Payment.findAll({ where: { userId: id } });
    },
    createpayment: async function (inputParam) {
        return await Payment.create(inputParam);
    },
    updatepayment: async function (inputParam, id) {
        await Payment.update(inputParam, { where: { checkoutId: id } });
        return Payment.findOne({
            where:
            {
                checkoutId: id
            }
        })
    }
}

module.exports = paymentConfig;