const express = require("express");
var router = express.Router();
var bodyParser = require('body-parser').json();
const helperUtil = require('../util/helper.js');
const currencyModel = require("../models/mvc_currencyconversionrate.js");


router.get('/getcurrency', bodyParser, async function (req, res) {
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    try {
        const currencyCollection = await currencyModel.getallCurrency();
        if (!currencyCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'there is no currency available');
        responseObj = { "currencyCollection": currencyCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'currency retrived successfully');

    } catch (error) {
        message = "currency retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
});
router.put('/currencyUpdate', bodyParser, async function (req, res) {
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    const ID = req.body.id;
    try {
        if (!ID) return await helperUtil.responseSender(res, 'data', 400, responseObj, 'Req param missing');
        const updateParam = {
            conversion_rate: req.body.conversion_rate
        }

        const currencyCollection = await currencyModel.updateCurrency(updateParam, ID);
        if (!currencyCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'there is no currency available');
        responseObj = { "currencyCollection": currencyCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'currency updated successfully');

    } catch (error) {
        message = "currency update Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
});



module.exports = router;