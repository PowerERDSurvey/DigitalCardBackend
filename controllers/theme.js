const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();
const themeModel = require("../models/mvc_theme");
const helperUtil = require('../util/helper.js');
const layout = require("../models/mvc_layout.js");

router.get('/getTheme/:cardId', bodyParser, async function (req, res) {
    const cardId = req.params.cardId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!cardId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const themeCollection = await themeModel.getThemeByCardId(cardId);
        if (!themeCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'there is no theme to get');

        // const layoutCollection = await layout.getAllLayout(themeCollection.dataValues.layoutId);
        const layoutCollection = await layout.getLayout(themeCollection.dataValues.layoutId);
        themeCollection.dataValues.layout = layoutCollection.dataValues;

        responseObj = { "themeCollection": themeCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'Theme collected successfully');
    } catch (error) {
        message = "Theme retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }


});

router.post('/createTheme', auth, bodyParser, async function (req, res) {
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    try {
        var inputparam = {
            "name": req.body.name,
            "layoutId": req.body.layoutId,
            "cardId": req.body.cardId,
            "fontFamily": req.body.fontFamily,
            "fontStyle": req.body.fontStyle,
            "backgroundColor": req.body.backgroundColor
        }
        const themeCollection = await themeModel.createTheme(inputparam);
        if (!themeCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'Theme created but no data to view');

        responseObj = { "themeCollection": themeCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'Theme created successfully');
    } catch (error) {
        message = "Theme creation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }


});

router.put('/updateTheme/:themeId', auth, bodyParser, async function (req, res) {
    const themeId = req.params.themeId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    try {
        if (!themeId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
        var inputparam = {
            "name": req.body.name,
            "layoutId": req.body.layoutId,
            "fontFamily": req.body.fontFamily,
            "fontStyle": req.body.fontStyle,
            "backgroundColor": req.body.backgroundColor
        }
        const themeCollection = await themeModel.updateTheme(inputparam, themeId);
        if (!themeCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'Theme created but no data to view');

        responseObj = { "themeCollection": themeCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'Theme updated successfully');
    } catch (error) {
        message = "Theme updation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }


});

module.exports = router;