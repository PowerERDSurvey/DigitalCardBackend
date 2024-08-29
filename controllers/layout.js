const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();
const layoutModel = require("../models/mvc_layout.js");
const userModel = require("../models/mvc_User.js");
const helperUtil = require('../util/helper.js');
const { sequelize } = require('../config/sequelize');

router.get('/getAllLayout', auth, bodyParser, async function (req, res) {
    const transaction = await sequelize.transaction();
    try {
        const layoutCollection = await layoutModel.getAllLayout(transaction);
        if (layoutCollection.length == 0) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'there is no layout In Active state');
        }

        await transaction.commit();
        return await helperUtil.responseSender(res, 'data', 200, { "layoutCollection": layoutCollection }, 'layout collected successfully');
    } catch (error) {
        await transaction.rollback();
        return await helperUtil.responseSender(res, 'error', 500, error, "layout retrieved Failed.");
    }
});

router.get('/getoneLayout/:layoutId', auth, bodyParser, async function (req, res) {
    const transaction = await sequelize.transaction();
    try {
        const layoutId = req.params.layoutId;
        if (!layoutId) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 500, {}, 'requested params missing');
        }

        const layoutCollection = await layoutModel.getLayout(layoutId, transaction);
        if (!layoutCollection) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'there is no layout In Active state');
        }

        await transaction.commit();
        return await helperUtil.responseSender(res, 'data', 200, { "layoutCollection": layoutCollection }, 'layout collected successfully');
    } catch (error) {
        await transaction.rollback();
        return await helperUtil.responseSender(res, 'error', 500, error, "layout retrieved Failed.");
    }
});

router.post('/createLayout', auth, bodyParser, async function (req, res) {
    const transaction = await sequelize.transaction();
    try {
        if (!req.body) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 500, {}, 'requested params missing');
        }
        var inputparam = {
            "name": req.body.name,
            "description": req.body.description,
            "isActive": req.body.isActive,
            "layoutComponentName": req.body.layoutComponentName
        };

        const layoutCollection = await layoutModel.createLayout(inputparam, transaction);
        if (!layoutCollection) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'layout created but no data to view');
        }

        await transaction.commit();
        return await helperUtil.responseSender(res, 'data', 200, { "layoutCollection": layoutCollection }, 'layout created successfully');
    } catch (error) {
        await transaction.rollback();
        return await helperUtil.responseSender(res, 'error', 500, error, "layout creation Failed.");
    }
});

router.put('/updateLayout/:superAdmin', auth, bodyParser, async function (req, res) {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.params.superAdmin;
        const layoutId = req.body.id;
        if (!layoutId) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 500, {}, 'requested params missing');
        }
        const getSuperAdmin = await userModel.getSuperAdmin(userId, transaction);
        if (!getSuperAdmin) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'company only can get by the SuperAdmin');
        }
        var inputparam = {
            "name": req.body.name,
            "description": req.body.description,
            // "isActive": req.body.isActive,
            // "layoutComponentName": req.body.layoutComponentName
        };

        const layoutCollection = await layoutModel.updateLayout(inputparam, layoutId, transaction);
        if (!layoutCollection) {
            await transaction.rollback();
            return await helperUtil.responseSender(res, 'error', 400, {}, 'layout updated but no data to view');
        }

        await transaction.commit();
        return await helperUtil.responseSender(res, 'data', 200, { "layoutCollection": layoutCollection }, 'layout updated successfully');
    } catch (error) {
        await transaction.rollback();
        return await helperUtil.responseSender(res, 'error', 500, error, "layout update Failed.");
    }
});

module.exports = router;