const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();
var bodyParser1 = require('body-parser');
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const helperUtil = require('../util/helper.js');
const paymentModel = require("../models/mvc_payment.js");


router.get('/getallpayments/:userId', auth, bodyParser, async function (req, res) {
    const userId = req.params.userId;
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {

        const payment_collection = await paymentModel.get_payment_by_userId(userId);

        if (!payment_collection) return await helperUtil.responseSender(res, 'error', 400, responseObj, "no payments");

        responseObj = { "paymentCollection": payment_collection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, `payment colected successfully`);

    } catch (error) {
        message = "payment retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})


router.get('/getallpayments', auth, bodyParser, async function (req, res) {
    var httpStatusCode = 500;
    var responseObj = {};
    try {

        const payment_collection = await paymentModel.getallpayment();

        if (!payment_collection) return await helperUtil.responseSender(res, 'error', 400, responseObj, "no payments");

        responseObj = { "paymentCollection": payment_collection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, `payment colected successfully`);

    } catch (error) {
        message = "payment retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})


router.post('/payment/checkOut:userId', auth, bodyParser, async function (req, res) {
    const userId = req.params.userId;
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        console.log('req data', req);


        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.BaseURL}/userSubscriptions`,
            cancel_url: `${process.env.BaseURL}/subscriptions`,
            line_items: [
                {
                    price_data: {
                        currency: req.body.currency,
                        product_data: {
                            name: req.body.planName
                        },
                        unit_amount: req.body.cost * 100
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
        });
        console.log(session.url);
        // if (session.payment_status )
        var inputParams = {
            checkoutId: session.id,
            subId: req.body.id,
            status: session.status,
            created: session.created,
            amount: session.amount_total / 100,
            paymentStatus: session.payment_status,
            userId: userId
        }

        const paymentCreate = await paymentModel.createpayment(inputParams);




        var url = session.url;
        return res.json({ 'url': url });
    } catch (error) {

        message = "payment intiation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})







module.exports = router;