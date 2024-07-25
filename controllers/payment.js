const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();
var bodyParser1 = require('body-parser');
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const helperUtil = require('../util/helper.js');




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


        var url = session.url;
        res.json({ 'url': url });
    } catch (error) {

        message = "subscription retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})







module.exports = router;