const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();
const companyModel = require("../models/mvc_company");
const userModel = require("../models/mvc_User.js");
const helperUtil = require('../util/helper.js');
const { where } = require("sequelize");
const { sequelize } = require('../config/sequelize');

router.get('/getAllCompanies/:superAdmin', auth, bodyParser, async function (req, res) {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.params.superAdmin;
        if (!userId) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 500, {}, 'requested params missing');
        }
        const getSuperAdmin = await userModel.getSuperAdmin(userId, transaction);
        if (!getSuperAdmin) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'company only can get by the SuperAdmin');
        }

        const companyCollection = await companyModel.get_All_ActiveCompanyById(transaction);
        if (companyCollection.length == 0) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'there is no company In Active state');
        }

        await transaction.commit();
        return await helperUtil.responseSender(res, 'data', 200, { "companyCollection": companyCollection }, 'company collected successfully');
    } catch (error) {
        await transaction.rollback();
        return await helperUtil.responseSender(res, 'error', 500, error, "company retrieved Failed.");
    }
})

router.get('/getCompanies/:companyId', auth, bodyParser, async function (req, res) {
    const transaction = await sequelize.transaction();
    try {
        const companyId = req.params.companyId;
        if (!companyId) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 500, {}, 'requested params missing');
        }

        const companyCollection = await companyModel.getActiveCompanyById(companyId, transaction);
        if (companyCollection.length == 0) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'there is no company In Active state');
        }

        await transaction.commit();
        return await helperUtil.responseSender(res, 'data', 200, { "companyCollection": companyCollection }, 'company collected successfully');
    } catch (error) {
        await transaction.rollback();
        return await helperUtil.responseSender(res, 'error', 500, error, "company retrieved Failed.");
    }
})

router.post('/createCompany/:SuperAdmin', auth, bodyParser, async function (req, res) {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.params.SuperAdmin;
        if (!userId) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 500, {}, 'requested params missing');
        }
        const getSuperAdmin = await userModel.getSuperAdmin(userId, transaction);
        if (!getSuperAdmin) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'company only can create by the SuperAdmin');
        }
        var inputparam = {
            "companyName": req.body.companyName,
            "address": req.body.address,
            "mobileNumber": req.body.mobileNumber,
            "emailAddress": req.body.emailAddress,
            "country": req.body.country,
            "state": req.body.state,
            "city": req.body.city,
            "zipcode": req.body.zipcode,
            "isDelete": false,
            "noOfUsers": req.body.noOfUsers,
            "noOfAdmin": req.body.noOfAdmin,
            "randomKey": req.body.randomKey,
            "isActive": true,
            "createdBy": userId,
            "updatedBy": userId
        };
        const companyCollection = await companyModel.createCompany(inputparam, transaction);
        if (!companyCollection) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'company created but retrieving data failed');
        }

        await transaction.commit();
        return await helperUtil.responseSender(res, 'data', 200, { "companyCollection": companyCollection }, 'company created successfully');
    } catch (error) {
        await transaction.rollback();
        return await helperUtil.responseSender(res, 'error', 500, error, "company creation Failed.");
    }
})

router.put('/updateCompany/:Admin', auth, bodyParser, async function (req, res) {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.params.Admin;
        if (!userId) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 500, {}, 'requested params missing');
        }
        const getSuperAdmin = await userModel.getSuperAdmin(userId, transaction);
        if (!getSuperAdmin) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'company only can update by the SuperAdmin');
        }
        var inputparam = {
            "companyName": req.body.companyName,
            "address": req.body.address,
            "mobileNumber": req.body.mobileNumber,
            "emailAddress": req.body.emailAddress,
            "country": req.body.country,
            "state": req.body.state,
            "city": req.body.city,
            "zipcode": req.body.zipcode,
            "noOfUsers": req.body.noOfUsers,
            "noOfAdmin": req.body.noOfAdmin,
            "isActive": req.body.isActive,
            "updatedBy": userId
        };
        const companyCollection = await companyModel.updateCompany(inputparam, req.body.companyId, transaction);
        if (!companyCollection) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'company updated but retrieving data failed');
        }

        const company_admin = await userModel.getALLUserbyQuery({
            where: {
                role: 'COMPANY_ADMIN',
                companyId: companyCollection.id
            },
            transaction
        });
        if (company_admin.length != 0) {
            if (req.body.noOfUsers < (company_admin[0].usercreatedCount)) {
                await transaction.rollback();
                return await helperUtil.responseSender(res, 'error', 400, {}, `Your company already have ${company_admin[0].usercreatedCount} user`);
            }
            companyadmin_reqbody = {
                userAllocatedCount: req.body.noOfUsers - company_admin[0].usercreatedCount
            }
            await userModel.update(company_admin[0].id, companyadmin_reqbody, { transaction });
        }

        await transaction.commit();
        return await helperUtil.responseSender(res, 'data', 200, { "companyCollection": companyCollection }, 'company updated successfully');
    } catch (error) {
        await transaction.rollback();
        return await helperUtil.responseSender(res, 'error', 500, error, "company update Failed.");
    }
})

router.post('/ActivateorDeactivate/:SuperAdmin/:companyRandomkey', auth, bodyParser, async function (req, res) {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.params.SuperAdmin;
        const companyKey = req.params.companyRandomkey;
        if (!userId || !companyKey) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 500, {}, 'requested params missing');
        }
        const getSuperAdmin = await userModel.getSuperAdmin(userId, transaction);
        if (!getSuperAdmin) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'company only can modify by the SuperAdmin');
        }
        const companyCollection = await companyModel.activateOrDeactivate(companyKey, req.body.isActive, userId, transaction);
        if (!companyCollection) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, `company ${req.body.isActive ? 'Activation' : 'deActivation'} failed`);
        }

        await transaction.commit();
        return await helperUtil.responseSender(res, 'data', 200, { "companyCollection": companyCollection }, `company ${req.body.isActive ? 'Activation' : 'deActivation'} successfully`);
    } catch (error) {
        await transaction.rollback();
        return await helperUtil.responseSender(res, 'error', 500, error, `company ${req.body.isActive ? 'Activation' : 'deActivation'} Failed.`);
    }
})

router.post('/deleteCompany/:userId', auth, bodyParser, async function (req, res) {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.params.userId;
        if (!userId) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 500, {}, 'requested params missing');
        }
        const getSuperAdmin = await userModel.getSuperAdmin(userId, transaction);
        if (!getSuperAdmin) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'company only can delete by the SuperAdmin');
        }

        const companyCollection = await companyModel.deleteCompany(req.body.companyId, transaction);
        if (!companyCollection) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, `company deletion failed`);
        }

        await transaction.commit();
        return await helperUtil.responseSender(res, 'data', 200, { "companyCollection": companyCollection }, `company deleted successfully`);
    } catch (error) {
        await transaction.rollback();
        return await helperUtil.responseSender(res, 'error', 500, error, `company deletion failed.`);
    }
})

module.exports = router;