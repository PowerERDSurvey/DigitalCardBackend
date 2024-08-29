const userRepo = require("../config/user");

let userModel = {
    create: async function (inputParams, transaction) {
        return await userRepo.create(inputParams, transaction);
    },
    getActiveEmails: async function (inputParams) {
        return await userRepo.getActiveEmails(inputParams);
    },
    update: async function (UserId, inputParams, transaction) {
        return await userRepo.update(UserId, inputParams, transaction);
    },
    getActivePassword: async function (inputParams) {
        return await userRepo.getActivePassword(inputParams);
    },
    getOneUser: async function (inputParams) {
        return await userRepo.getOneUser(inputParams);
    },
    getALLUserbyQuery: async function (inputParams) {
        return await userRepo.getALLUserbyQuery(inputParams);
    },




    getUser: async function (inputParams) {
        return await userRepo.getUser(inputParams);
    },

    getUsertokenById: async function (userId, verificationCode) {
        return await userRepo.getUsertokenById(userId, verificationCode);
    },

    getSuperAdmin: async function (userId) {
        return await userRepo.getSuperAdmin(userId);
    },
    getUserByRole: async function (role) {
        return await userRepo.getUserByRole(role);
    },
    getCompanybasedUser: async function (companyId, role) {
        return await userRepo.getCompanybasedUser(companyId, role);
    },

    deleteUser: async function (adminId, userId, transaction) {
        return await userRepo.deleteUser(adminId, userId, transaction);
    },

}

module.exports = userModel;