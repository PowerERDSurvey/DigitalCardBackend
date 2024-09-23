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



module.exports = router;