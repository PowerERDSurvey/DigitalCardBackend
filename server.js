const express=require("express");
const cors=require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
// const config = require('./config/dbConfig');
var Cryptr = require('cryptr');
var cryptr = new Cryptr('myTotalySecretKey');
var path = require('path');
global.__basedir = __dirname ;
var multer = require('multer');
var uploadFile = multer({dest:'./uploads/'});
const config = require('./config/config.js');
const sendVerificationEmail = require('./util/emailSender.js');
const port = process.env.PORT || 8080;
const cardModel = require("./models/mvc_BusinessCard.js");
const companyModel = require("./models/mvc_company.js");

const cardImageModel = require("./models/mvc_businessCardImage.js");
const userSubscriptionModel = require("./models/mvc_userSubscription.js");
const subscriptionModel = require("./models/mvc_subscription.js");

const productModel = require("./models/mvc_product.js");

const userImageModel = require("./models/mvc_UserImage.js");

const auth = require('./middleware/auth.js');
const userModel = require("./models/mvc_User");
const helperUtil = require('./util/helper.js');

const upload = require('./middleware/upload.js');
// var bodyParser = require('body-parser').json();
const app = express();
app.use(cors());
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

// Endpoint to get the Google Client ID
app.get('/api/google-client-id', (request, res) => {
    try {
        var httpStatusCode = 200;
        var responseObj = {};
        responseObj = {clientId: process.env.GOOGLE_CLIENT_ID};
        var response = { "status": httpStatusCode, "data": responseObj, "message": "Google Key fetched" };
        // res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
        return res.status(httpStatusCode).json(response);
    } catch (error) {
        httpStatusCode = 500;
        response = { "status": httpStatusCode, "message": "Google Key Failed" };
        return res.status(httpStatusCode).json(response);
    }
});
  
// Redirect user to Google consent screen
app.get('/auth/google', (req, res) => {
    var httpStatusCode = 200;
    var responseObj = {};
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
    });
    responseObj = { url: authUrl };
    var response = { "status": httpStatusCode, "data": responseObj, "message": "Google Key fetched" };
    return res.status(httpStatusCode).json(response);
    // res.redirect(authUrl);
  });

  // Callback endpoint to handle Google response
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
        // Retrieve user info using Google OAuth2 API
        const oauth2 = google.oauth2({
            auth: oAuth2Client,
            version: 'v2'
        });

        const userInfo = await oauth2.userinfo.get();
        const { name, email } = userInfo.data;
        const data = Buffer.from(JSON.stringify(userInfo.data)).toString('base64');



        const fullUrl = `${req.protocol}://${req.hostname}:3000`
        console.log('Hostname:', fullUrl);
        process.env.BaseURL = fullUrl;
        // Pass token to frontend (or handle as needed)
        res.redirect(`${fullUrl}/googleLogin/${data}`);
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      res.status(500).send('Authentication failed');
    }
  });

const allowedOrigins = [ 'https://checkout.stripe.com'];
app.use((req, res, next) => {
    const fullUrl = `${req.protocol}://${req.hostname}:3000`
    console.log('Hostname:', fullUrl);
    process.env.BaseURL = fullUrl;
    allowedOrigins.push(fullUrl);
    next();
});

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin like mobile apps or curl requests
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};



// app.use(express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(__dirname + "/public"));
console.log(__dirname, 'DIR')



const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    var endpointSecret = process.env.STRIPE_END_POINT_SECRET;
    // process.env.BaseURL == 'http://localhost:3000' ? endpointSecret = "whsec_2e90767501784982e709d966a4edd71344707f3fcab22ebba31e5ef6dacf1514" : endpointSecret = "we_1Pl1pPBrB64sXHWF6kW6WfkM";

    const sig = request.headers['stripe-signature'];
    var responseObj = {};

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const session = event.data.object;
            console.log('event------', session);
            

            const sessions = await stripe.checkout.sessions.list({
                payment_intent: session.id
            });

            if (sessions.data.length > 0) {
                // Retrieve the Checkout Session
                const session = sessions.data[0];
                console.log('event------2', session);

                
                // Retrieve the line items
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

                // return lineItems.data;

                var inputParam ={
                    productName: lineItems.data[0].description,
                    paymentStatus: session.payment_status,
                    status: session.status

               }

                const paymetscollection =await paymentModel.updatepayment(inputParam, session.id);


                const userCollection = await userModel.getUser(paymetscollection.userId);

                var user_sub_inputParam = {
                    subscriptionName: lineItems.data[0].description,
                    startDate: now(),
                    // endDate: DataTypes.DATE,
                    userId: userCollection.id,
                    subscriptionId: paymetscollection.subId,
                    isActive: true,
                    // companyId: userCollection.companyId
                }

                if (userCollection?.companyId) {
                    user_sub_inputParam = {
                        subscriptionName: lineItems.data[0].description,
                        startDate: now(),
                        // endDate: DataTypes.DATE,
                        // userId: userCollection.id,
                        subscriptionId: paymetscollection.subId,
                        isActive: true,
                        companyId: userCollection.companyId
                    }
                }


                const user_sub_collection = await userSubscriptionModel.createuserSubscription(user_sub_inputParam);
                const sub_collection = await subscriptionModel.getAllSubscriptionByquery({ where: { id: paymetscollection.subId } });
                const getplans = await productModel.getOneProductById(sub_collection[0].productId);
                const user_update = await userModel.update(userCollection.id,{
                    cardAllocationCount: userCollection.cardAllocationCount + getplans.cardCount
                });
                if (!user_update) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'updation faild');
            }
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

//app.use(uploadOne.array()); 
// app.use(uploadFile.any()); 
//testing

// app.get('/contact',(req,res)=>{
//     res.send("get all contact");
// })

app.use('/uploads', express.static(path.join(__dirname, 'resources/static/assets/uploads')));

var User = require("./controllers/user.js");
console.log(User);
app.use("/",User);


var CardCreation = require('./controllers/businessCard.js');
app.use("/",CardCreation);

var Payment = require('./controllers/payment.js');
app.use("/", Payment);

var CompanyCreation = require('./controllers/company.js');
app.use("/",CompanyCreation);


var layoutCreation = require('./controllers/layout.js');
app.use("/",layoutCreation);

var ProductCreation = require('./controllers/product.js');
app.use("/",ProductCreation);

var SubscriptionCreation = require('./controllers/subscription.js');
app.use("/",SubscriptionCreation);

var ThemeCreation = require('./controllers/theme.js');
app.use("/",ThemeCreation);

var userSubscriptionCreation = require('./controllers/userSubscription.js');
app.use("/",userSubscriptionCreation);

var CountryANDState = require('./controllers/countryAndState.js');
app.use("/",CountryANDState);

// app.use();


// async function cardAllocation(requestBody, UserId, old_data, res) {
//     if (requestBody.role == 'COMPANY_ADMIN' || requestBody.role == 'INDIVIDUAL_USER') {
//         // requestBody.userAllocatedCount = requestBody.userAllocatedCount - 1;
//         // requestBody.usercreatedCount = requestBody.usercreatedCount + 1;
//         return;
//     } else if(old_data.userAllocatedCount == requestBody.userAllocatedCount) {
//         if (!requestBody.assignedBy) return;
//         const superior_datum = await userModel.getUser(requestBody.assignedBy);
//         // if (superior_datum.userAllocatedCount > requestBody.userAllocatedCount) return await helperUtil.responseSender(res, 'error', 400, {}, `you can give maximum user as ${superior_datum.userAllocatedCount}`); //todo//initially it will zero
//         // if (superior_datum.cardAllocationCount > requestBody.cardAllocationCount) return await helperUtil.responseSender(res, 'error', 400, {}, `you can give maximum user as ${superior_datum.cardAllocationCount}`); //todo//initially it will zero

//         // var count_to_be_reduce = 0;
//         // requestBody.userAllocatedCount != 0 ? count_to_be_reduce = requestBody.userAllocatedCount + 1 : count_to_be_reduce = 1;
//         var superior_datum_param = {};
//         if (requestBody.cardAllocationCount != 0) {
//             if (requestBody.cardAllocationCount > old_data.cardAllocationCount) {
//                 superior_datum_param = {
//                     ...superior_datum_param,
//                     // createdcardcount: superior_datum.usercreatedCount + requestBody.cardCreatedCount,
//                     cardAllocationCount: superior_datum.cardAllocationCount - (requestBody.cardAllocationCount - old_data.cardAllocationCount)
//                 }
//             }
//             else if(requestBody.cardAllocationCount < old_data.cardAllocationCount) {
//                 superior_datum_param = {
//                     ...superior_datum_param,
//                     // createdcardcount: superior_datum.usercreatedCount + requestBody.cardCreatedCount,
//                     cardAllocationCount: superior_datum.cardAllocationCount + (old_data.cardAllocationCount - requestBody.cardAllocationCount )
//                 }
//             }

            
//         } else if(requestBody.cardAllocationCount == 0 && old_data.cardAllocationCount != 0 ) {
//             superior_datum_param = {
//                 ...superior_datum_param,
//                 // createdcardcount: superior_datum.usercreatedCount + requestBody.cardCreatedCount,
//                 cardAllocationCount: superior_datum.cardAllocationCount + old_data.cardAllocationCount
//             }
//         }
//         const update_superior = await userModel.update(superior_datum.id, superior_datum_param);
//         return;
//     } else{
//         if (!requestBody.assignedBy) return;
//         const superior_datum = await userModel.getUser(requestBody.assignedBy);
//         // if (superior_datum.userAllocatedCount > requestBody.userAllocatedCount) return await helperUtil.responseSender(res, 'error', 400, {}, `you can give maximum user as ${superior_datum.userAllocatedCount}`); //todo//initially it will zero
//         // if (superior_datum.cardAllocationCount > requestBody.cardAllocationCount) return await helperUtil.responseSender(res, 'error', 400, {}, `you can give maximum user as ${superior_datum.cardAllocationCount}`); //todo//initially it will zero

//         // var count_to_be_reduce = 0;
//         // requestBody.userAllocatedCount != 0 ? count_to_be_reduce = requestBody.userAllocatedCount + 1 : count_to_be_reduce = 1;
//         var superior_datum_param = {};
//         var old_allocated_count = old_data.userAllocatedCount + old_data.usercreatedCount;
//         if (requestBody.userAllocatedCount != 0) {
//             if (requestBody.userAllocatedCount > old_allocated_count) {
//                 superior_datum_param = {
//                     ...superior_datum_param,
//                     userAllocatedCount: superior_datum.userAllocatedCount - (requestBody.userAllocatedCount - old_allocated_count),
//                     usercreatedCount: superior_datum.usercreatedCount + (requestBody.userAllocatedCount - old_allocated_count)
//                 }
//                 requestBody.userAllocatedCount = requestBody.userAllocatedCount - old_data.usercreatedCount;
//             }
//             if (requestBody.userAllocatedCount < old_allocated_count) {
//                 // cardcount
//                 const exist_user = await userModel.getALLUserbyQuery({ where: { isDelete: false, assignedBy: UserId } });

//                 if (exist_user.length > requestBody.userAllocatedCount) return await helperUtil.responseSender(res, 'error', 400, {}, `Already the account have ${exist_user.length} user. please delete and try to update`);

//                 superior_datum_param = {
//                     ...superior_datum_param,
//                     userAllocatedCount: superior_datum.userAllocatedCount + (old_allocated_count - requestBody.userAllocatedCount),
//                     usercreatedCount: superior_datum.usercreatedCount - (old_allocated_count - requestBody.userAllocatedCount)
//                 }
//                 // requestBody.userAllocatedCount = old_allocated_count - requestBody.userAllocatedCount;
//                 requestBody.userAllocatedCount = requestBody.userAllocatedCount - old_data.usercreatedCount;
//             }
//         } else {
//             requestBody.isUserCardAllocated = false;
//             superior_datum_param = {
//                 ...superior_datum_param,
//                 userAllocatedCount: superior_datum.userAllocatedCount + (old_allocated_count - requestBody.userAllocatedCount),
//                 usercreatedCount: superior_datum.usercreatedCount - old_allocated_count
//             }
//             requestBody.userAllocatedCount = requestBody.userAllocatedCount - old_data.usercreatedCount;
//         }
        
//         if (requestBody.cardAllocationCount != 0) {
//             if (requestBody.cardAllocationCount > old_data.cardAllocationCount) {
//                 superior_datum_param = {
//                     ...superior_datum_param,
//                     // createdcardcount: superior_datum.usercreatedCount + requestBody.cardCreatedCount,
//                     cardAllocationCount: superior_datum.cardAllocationCount - (requestBody.cardAllocationCount - old_data.cardAllocationCount)
//                 }
//             }
//             else if(requestBody.cardAllocationCount < old_data.cardAllocationCount) {
//                 superior_datum_param = {
//                     ...superior_datum_param,
//                     // createdcardcount: superior_datum.usercreatedCount + requestBody.cardCreatedCount,
//                     cardAllocationCount: superior_datum.cardAllocationCount + (old_data.cardAllocationCount - requestBody.cardAllocationCount )
//                 }
//             }

            
//         } else if(requestBody.cardAllocationCount == 0 && old_data.cardAllocationCount != 0 ) {
//             superior_datum_param = {
//                 ...superior_datum_param,
//                 // createdcardcount: superior_datum.usercreatedCount + requestBody.cardCreatedCount,
//                 cardAllocationCount: superior_datum.cardAllocationCount + old_data.cardAllocationCount
//             }
//         }

//         const update_superior = await userModel.update(superior_datum.id, superior_datum_param);
//         return;
//     }



// }
async function cardAllocation(requestBody, UserId, old_data, res) {
    if (requestBody.role === 'COMPANY_ADMIN' || requestBody.role === 'INDIVIDUAL_USER') {
        return;
    }

    if (!requestBody.assignedBy) return;

    const superior_datum = await userModel.getUser(requestBody.assignedBy);
    let superior_datum_param = {};

    // Update card allocation count
    if (requestBody.cardAllocationCount !== old_data.cardAllocationCount) {
        const allocationDifference = requestBody.cardAllocationCount - old_data.cardAllocationCount;

        superior_datum_param.cardAllocationCount =
            superior_datum.cardAllocationCount - allocationDifference;

        if (requestBody.cardAllocationCount === 0 && old_data.cardAllocationCount !== 0) {
            superior_datum_param.cardAllocationCount += old_data.cardAllocationCount;
        }
    }

    const old_allocated_count = old_data.userAllocatedCount + old_data.usercreatedCount;

    if (requestBody.userAllocatedCount !== old_allocated_count) {
        if (requestBody.userAllocatedCount > old_allocated_count) {
            const allocationDifference = requestBody.userAllocatedCount - old_allocated_count;
            superior_datum_param.userAllocatedCount =
                superior_datum.userAllocatedCount - allocationDifference;
            superior_datum_param.usercreatedCount =
                superior_datum.usercreatedCount + allocationDifference;

            requestBody.userAllocatedCount -= old_data.usercreatedCount;

        } else if (requestBody.userAllocatedCount < old_allocated_count) {
            const exist_user = await userModel.getALLUserbyQuery({
                where: { isDelete: false, assignedBy: UserId }
            });

            if (exist_user.length > requestBody.userAllocatedCount) {
                return await helperUtil.responseSender(res, 'error', 400, {},
                    `Already the account has ${exist_user.length} users. Please delete and try to update.`);
            }

            const allocationDifference = old_allocated_count - requestBody.userAllocatedCount;
            superior_datum_param.userAllocatedCount =
                superior_datum.userAllocatedCount + allocationDifference;
            superior_datum_param.usercreatedCount =
                superior_datum.usercreatedCount - allocationDifference;

            requestBody.userAllocatedCount -= old_data.usercreatedCount;
        }
    } else {
        requestBody.isUserCardAllocated = false;
        superior_datum_param.userAllocatedCount =
            superior_datum.userAllocatedCount + old_allocated_count;
        superior_datum_param.usercreatedCount =
            superior_datum.usercreatedCount - old_allocated_count;

        requestBody.userAllocatedCount -= old_data.usercreatedCount;
    }

    await userModel.update(superior_datum.id, superior_datum_param);
}


// async function getDifferences(requestBody, old_data) {
//     const differences = {};

//     for (const key in requestBody) {
//         if (requestBody.hasOwnProperty(key)) {
//             const newValue = requestBody[key
//             ];
//             const oldValue = old_data[key
//             ];

//             // Skip if the new value is undefined, null, or if the values are the same
//             if (
//                 newValue !== undefined &&
//                 newValue !== null &&
//                 newValue !== "undefined" &&
//                 newValue != oldValue &&
//                 typeof newValue == typeof oldValue
//                 // newValue != oldValue
//             ) {
//                 differences[key] = newValue;
//             }
//         }
//     }

//     return differences;
// }

function getDifferences(requestBody, old_data) {
    const differences = {};
  
    for (const key in requestBody) {
      if (requestBody.hasOwnProperty(key)) {
        const newValue = requestBody[key];
        const oldValue = old_data[key];
  
        // Skip undefined, null, and the string "undefined" in newValue
        if (newValue !== undefined && newValue !== null && newValue !== "undefined") {
          
          // Convert string to number if the old value is a number and the new value is a numeric string
          if (typeof oldValue === 'number' && typeof newValue === 'string' && !isNaN(newValue)) {
            const coercedNewValue = Number(newValue);
            if (coercedNewValue !== oldValue) {
              differences[key] = {
                oldValue: oldValue,
                newValue: coercedNewValue
              };
            }
          } 
          // Compare as strings
          else if (typeof oldValue === 'string' && typeof newValue === 'number') {
            const coercedOldValue = String(oldValue);
            if (coercedOldValue !== newValue) {
              differences[key] = {
                oldValue: oldValue,
                newValue: String(newValue)
              };
            }
          } 
          // Handle other comparisons where types match
          else if (newValue !== oldValue && typeof newValue === typeof oldValue) {
            differences[key] = newValue;
          }
          else if ( oldValue == null && (typeof newValue === 'string' || typeof newValue === 'number')) {
            differences[key] = newValue;
            // const coercedNewValue = Number(newValue);
            // if (coercedNewValue !== oldValue) {
            //   differences[key] = {
            //     oldValue: oldValue,
            //     newValue: coercedNewValue
            //   };
            // }
          } 
        }
      }
    }
  
    return differences;
  }
app.put("/user/:ID",auth,upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]), async function (req, res) {

    try {
   

        var UserId = req.params.ID;
        

        const old_data = await userModel.getUser(UserId);
        console.log('olddata', old_data.dataValues);

    // var requestBody =  req.body;
    var requestBody =  {
        userName: req.body.userName != 'null' && req.body.userName != 'undefined'?  req.body.userName :null,
        firstName: req.body.firstName != 'null' && req.body.firstName != 'undefined'?  req.body.firstName :null,
        lastName: req.body.lastName != 'null' && req.body.lastName != 'undefined'? req.body.lastName: null,
        primaryEmail: req.body.primaryEmail != 'null' && req.body.primaryEmail != 'undefined'? req.body.primaryEmail :null,
        // secondaryEmail: req.body.secondaryEmail != 'null' && req.body.secondaryEmail != 'undefined'? req.body.secondaryEmail : null,
        isActive: req.body.isActive != 'null' && req.body.isActive != 'undefined'? req.body.isActive : null,
        verificationCode: req.body.verificationCode != 'null' && req.body.verificationCode != 'undefined'? req.body.verificationCode : null,
        isEmailVerified: req.body.isEmailVerified != 'null' && req.body.isEmailVerified != 'undefined'? req.body.isEmailVerified : null,
        mobileNumber: req.body.mobileNumber != 'null' && req.body.mobileNumber != 'undefined'? req.body.mobileNumber : null,
        companyName: req.body.companyName != 'null' && req.body.companyName != 'undefined'? req.body.companyName : null,
        designation: req.body.designation != 'null' && req.body.designation != 'undefined'? req.body.designation : null,
        whatsapp: req.body.whatsapp != 'null' && req.body.whatsapp != 'undefined'? req.body.whatsapp : null,
        facebook: req.body.facebook != 'null' && req.body.facebook != 'undefined'? req.body.facebook : null,
        instagram: req.body.instagram != 'null' && req.body.instagram != 'undefined'? req.body.instagram : null,
        linkedin: req.body.linkedin != 'null' && req.body.linkedin != 'undefined'? req.body.linkedin : null,
        website: req.body.website != 'null' && req.body.website != 'undefined'? req.body.website : null,
        city: req.body.city != 'null' && req.body.city != 'undefined'? req.body.city : null,
        zipCode: req.body.zipCode != 'null' && req.body.zipCode != 'undefined'? req.body.zipCode : null,
        country: req.body.country != 'null' && req.body.country != 'undefined'? req.body.country : null,
        state: req.body.state != 'null' && req.body.state != 'undefined'? req.body.state : null,
        Address: req.body.address != 'null' && req.body.address != 'undefined'? req.body.address : null,
        aboutMe: req.body.aboutMe != 'null' && req.body.aboutMe != 'undefined'? req.body.aboutMe : null,
        youtube: req.body.youtube != 'null' && req.body.youtube != 'undefined'? req.body.youtube : null,
        department: req.body.department != 'null' && req.body.department != 'undefined'? req.body.department : null,
        role: req.body.role != 'null' && req.body.role != 'undefined' ? req.body.role : null,
        usercreatedCount: req.body.usercreatedCount != 'null' && req.body.usercreatedCount != 'undefined' ? req.body.usercreatedCount : 0 ,
        userAllocatedCount: req.body.userAllocatedCount != 'null' && req.body.userAllocatedCount != 'undefined' ? req.body.userAllocatedCount : 0 ,
        createdcardcount: req.body.createdcardcount != 'null' && req.body.createdcardcount != 'undefined' ? req.body.createdcardcount : 0 ,
        cardAllocationCount: req.body.cardAllocationCount != 'null' && req.body.cardAllocationCount != 'undefined' ? req.body.cardAllocationCount : 0 ,
        companyId: req.body.companyId,
        assignedBy: req.body.assignedBy,
        isUserCardAllocated: req.body.isUserCardAllocated != 'null' && req.body.isUserCardAllocated != 'undefined' ? req.body.isUserCardAllocated: false,
        };
        console.log('requestBody', requestBody);

        const modified_re_body = await getDifferences(requestBody, old_data);
        if (Object.keys(modified_re_body).length === 0 && !(req.files)) return await helperUtil.responseSender(res, 'error', 400, {}, 'No data to update');
        if (modified_re_body?.isActive) {
            const getUser = await userModel.getALLUserbyQuery({ where: { id: UserId } });
            if (getUser.length == 0) return await helperUtil.responseSender(res, 'error', 400, {}, 'dont have user to update the password');
            if (getUser[0].dataValues.verificationCode != 'verified') return await helperUtil.responseSender(res, 'error', 400, {}, 'Account not verified');
        }
        if (req.body?.password) {
            const getUser = await userModel.getALLUserbyQuery({ where: { id: UserId } });
            if (getUser.length == 0) return  await helperUtil.responseSender(res, 'error', 400, {}, 'dont have user to update the password');
            if (req.body.component == 'ChangePassword')  if (cryptr.decrypt(getUser[0].dataValues.password) != req.body.oldPassword) return await helperUtil.responseSender(res, 'error', 400, {}, 'Old password does not match');
            if (req.body.component == 'forgotPassword' && getUser[0].dataValues.passwordVerificationCode == 'verified') return await helperUtil.responseSender(res, 'error', 400, {}, 'link invalid/ Aldeary changed the password');
            requestBody = {
                password: cryptr.encrypt(req.body.password),
                passwordVerificationCode: 'verified'
            }
        }

        var pass = await helperUtil.generateRandomPassword();
        const token = jwt.sign({ email: req.body.primaryEmail }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
        if (modified_re_body?.lastName || modified_re_body?.firstName) {
            const get_allCard = await cardModel.getALLCardbyUserId(UserId);
            var cardIds = [];
            for (let index = 0; index < get_allCard.length; index++) {
                cardIds.push(get_allCard[index].id);
                
            }
            var input_param = {
                firstName: modified_re_body?.firstName,
                lastName: modified_re_body?.lastName,
            }
            await cardModel.updateCard(input_param, cardIds)
        }
      if (modified_re_body?.primaryEmail && modified_re_body?.primaryEmail != 'null') {
         requestBody.password = null;
         requestBody.randomInitialPassword = cryptr.encrypt(pass),
          requestBody.isEmailVerified = false;
          requestBody.verificationCode = token;
          requestBody.isActive = false;
          requestBody.userName = req.body.userName;

        }
        
        if ((modified_re_body.usercreatedCount != 'null' && modified_re_body.usercreatedCount != 'undifined') ||
            (modified_re_body.userAllocatedCount != 'null' && modified_re_body.userAllocatedCount != 'undifined') ||
            (modified_re_body.createdcardcount != 'null' && modified_re_body.createdcardcount != 'undifined') ||
            (modified_re_body.cardAllocationCount != 'null' && modified_re_body.cardAllocationCount != 'undifined')) {

            await cardAllocation(requestBody, UserId, old_data, res);
        }
      var message = "User updated successfully";
      var httpStatusCode = 500;
      var responseObj = {};
      if (!UserId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');

        requestBody.updatedBy = req.body.updatedBy;

        const userUpdate = await userModel.update(UserId, requestBody);
        if(!userUpdate) return await helperUtil.responseSender(res,'error',400,responseObj, 'user updated. but waiting for response please contact BC');

        if (modified_re_body?.primaryEmail && modified_re_body?.primaryEmail != 'null') {
        // const emailSent = await sendVerificationEmail.sendVerificationEmail(UserId, req.body.primaryEmail, token,{password:cryptr.decrypt(userUpdate.dataValues.password), userName :userUpdate.dataValues.userName });
        const emailSent = await sendVerificationEmail.sendInitialVerificationEmail(UserId, req.body.primaryEmail, token, { password: cryptr.decrypt(userUpdate.dataValues.randomInitialPassword), userName: userUpdate.dataValues.userName });


            if (!emailSent) {
                return await helperUtil.responseSender(res,'error',400,responseObj, 'Verification email sending failed.');
            }
        }
        
        if (req.files) {
            // const imageUpload = helperUtil.
            try {
                const imagesUpdation = await helperUtil.uplaodUserImage(UserId, req.files);
                if(!imagesUpdation) return await helperUtil.responseSender(res,'error',400,responseObj, 'images updated. but waiting for response please contact BC');
                const images = await userImageModel.getAllUserImageByUserId(UserId);
                if(!images) return await helperUtil.responseSender(res,'error',400,responseObj, 'images getting failed. but waiting for response please contact BC');
                if (images) {
                    httpStatusCode = 200;
                    responseObj = userUpdate.dataValues;
                    responseObj.images = images;
                    response = { "status": httpStatusCode, "data": responseObj, "message": message };
                } else {
                    httpStatusCode = 400;
                    response = { "status": httpStatusCode, "message": "Image upload failed" };
                }
                return res.status(httpStatusCode).json(response);
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        } else {
            httpStatusCode = 200;
            responseObj = userUpdate.dataValues;
            response = { "status": httpStatusCode, "data": responseObj, "message": message };
        }
        
    } catch (error) {
        message = "User Updation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',500, responseObj, message);
    }
    
    
});


async function cardImageUpload(req, cardId,res) {
    const images = [];
    if (req.files.profilePhoto) {
        const profileImage = await cardImageModel.createByCardId(req.files.profilePhoto[0], "profilePhoto", cardId);
        images.push(profileImage);
    }
    if (req.files.coverPhoto) {
        const coverPhoto = req.files.coverPhoto[0];
        const coverImage = await cardImageModel.createByCardId(coverPhoto, "coverPhoto", cardId);
        images.push(coverImage);
    }

    // const cardcollection = await cardModel.getACard(cardId);
    // if (!cardcollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'The cards not in active state');

    return images;
}

app.post('/user/createCard/:userId', auth, upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
]), async function (req, res) {
    const userId = req.params.userId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        //---------------------subscription plan---------------

        var inputparam = {
            userId: userId != 'null' ? userId : null,
            firstName: req.body.firstName != 'null' && req.body.firstName != 'undefined' ? req.body.firstName : null,
            lastName: req.body.lastName != 'null' && req.body.lastName != 'undefined' ? req.body.lastName : null,
            primaryEmail: req.body.secondaryEmail != 'null' && req.body.secondaryEmail != 'undefined' ? req.body.secondaryEmail : null,
            // primaryEmail: req.body.primaryEmail != 'null' && req.body.primaryEmail != 'undefined' ? req.body.primaryEmail : null,
            // isActive: req.body.isActive != 'null' && req.body.isActive != 'undefined' ? req.body.isActive : false,
            verificationCode: req.body.verificationCode != 'null' && req.body.verificationCode != 'undefined' ? req.body.verificationCode : null,
            isEmailVerified: req.body.isEmailVerified != 'null' && req.body.isEmailVerified != 'undefined' ? req.body.isEmailVerified : null,
            mobileNumber: req.body.mobileNumber != 'null' && req.body.mobileNumber != 'undefined' ? req.body.mobileNumber : null,
            companyName: req.body.companyName != 'null' && req.body.companyName != 'undefined' ? req.body.companyName : null,
            designation: req.body.designation != 'null' && req.body.designation != 'undefined' ? req.body.designation : null,
            whatsapp: req.body.whatsapp != 'null' && req.body.whatsapp != 'undefined' ? req.body.whatsapp : null,
            facebook: req.body.facebook != 'null' && req.body.facebook != 'undefined' ? req.body.facebook : null,
            instagram: req.body.instagram != 'null' && req.body.instagram != 'undefined' ? req.body.instagram : null,
            linkedin: req.body.linkedin != 'null' && req.body.linkedin != 'undefined' ? req.body.linkedin : null,
            website: req.body.website != 'null' && req.body.website != 'undefined' ? req.body.website : null,
            city: req.body.city != 'null' && req.body.city != 'undefined' ? req.body.city : null,
            zipCode: req.body.zipCode != 'null' && req.body.zipCode != 'undefined' ? req.body.zipCode : null,
            country: req.body.country != 'null' && req.body.country != 'undefined' ? req.body.country : null,
            state: req.body.state != 'null' && req.body.state != 'undefined' ? req.body.state : null,
            Address: req.body.address != 'null' && req.body.address != 'undefined' ? req.body.address : null,
            aboutMe: req.body.aboutMe != 'null' && req.body.aboutMe != 'undefined' ? req.body.aboutMe : null,
            youtube: req.body.youtube != 'null' && req.body.youtube != 'undefined' ? req.body.youtube : null,
            department: req.body.department != 'null' && req.body.department != 'undefined' ? req.body.department : null,
            vCardDetails: req.body.vCardDetails != 'null' && req.body.vCardDetails != 'undefined' ? req.body.vCardDetails : null,
            randomKey: req.body.randomKey != 'null' && req.body.randomKey != 'undefined' ? req.body.randomKey : null,
            isDelete: false,
        };
        const existing_card_cout = await cardModel.getALLCardbyUserId(userId);

        const userDetail = await userModel.getUser(userId);
        if (!userDetail) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'userDetail not found');
        // const active_cards = await cardModel.getALLActiveCardbyUserId(userId);
        if (existing_card_cout.length > 0) { 
            if (userDetail.cardAllocationCount != 0) {
                inputparam.isActive = true; 
                const user_update = await userModel.update(userDetail.id, {
                    createdcardcount: userDetail.createdcardcount + 1,
                    cardAllocationCount: userDetail.cardAllocationCount - 1
                });
                if (!user_update) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'Creation faild');
            } else {
                
                inputparam.isActive = false; 
            }
        } else {
            inputparam.isActive = true; 
            const user_update = await userModel.update(userDetail.id, {
                createdcardcount: userDetail.createdcardcount + 1,
                cardAllocationCount: userDetail.cardAllocationCount - 1
            });
            if (!user_update) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'Creation faild');
        }



        // const existing_card_cout = await cardModel.getALLCardbyUserId(userId);

        // get company id for the user  
        // const userDetail = await userModel.getUser(userId);
        // if (!userDetail) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'userDetail not found');

        // if (userDetail.companyId) {
        //     const company_detail = await companyModel.getActiveCompanyById(userDetail.companyId);
        //     // const active_cards = await cardModel.getALLActiveCardbyUserId(userId);
        //     if (company_detail.ActiveCardCount <= active_cards.length) return await helperUtil.responseSender(res, 'error', 400, responseObj, `You can only hold ${company_detail.ActiveCardCount} cards please deactivate one card and try to create. `);
        // }

        // if (existing_card_cout.length > 0) {
        //     var limit_message = userDetail.role == 'INDIVIDUAL_USER' ?`Limit reached. please purchase for more card` : `Limit reached. Your account didn't allocated other than free card. please contact your hierarchy`;

        //     if (userDetail.cardAllocationCount == 0) return await helperUtil.responseSender(res, 'error', 400, responseObj, limit_message);


        //     if ((userDetail.createdcardcount + userDetail.cardAllocationCount) <= userDetail.createdcardcount ) return await helperUtil.responseSender(res, 'error', 400, responseObj, `Limit reached. Already you have ${userDetail.createdcardcount} out of ${userDetail.cardAllocationCount}`);




        // }
        


       

        const cardCollection = await cardModel.createcreateCard(inputparam);
        if (!cardCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'there is no error on database but not created please contact BC service');
        responseObj = { "cardCollection": cardCollection };
        // const images = [];
        // const getUserImage = await userImageModel.getAllUserImageByUserId(userId);
        // if (getUserImage.length > 0) {
        //     for (let index = 0; index < getUserImage.length; index++) {
        //         getUserImage[index].path = getUserImage[index].filepath;
        //         const Images = await cardImageModel.createByCardId(getUserImage[index], getUserImage[index].type, cardCollection.id);
        //         images.push(Images);

        //     }

        // };
        const images = await cardImageUpload(req, cardCollection.id, res);
        // if(existing_card_cout.length > 0 ) {
        //     const user_update = await userModel.update(userDetail.id, {
        //         createdcardcount: userDetail.createdcardcount + 1,
        //         cardAllocationCount: userDetail.cardAllocationCount-1
        //     });
        //     if (!user_update) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'Creation faild');
        // }

        responseObj.cardCollection.dataValues.images = images;
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'Card Created successfully');
    }
    catch (error) {
        message = "card creation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
});




app.put('/user/card/update/:cardId',auth,upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]),async function (req, res) {
    const cardId = req.params.cardId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!cardId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        var inputparam = {
            firstName: req.body.firstName != 'null'? req.body.firstName : null,
            lastName: req.body.lastName != 'null'? req.body.lastName : null,
            primaryEmail: req.body.secondaryEmail != 'null' ? req.body.secondaryEmail : null,
            // isActive: req.body.isActive != 'null'? req.body.isActive : null,
            verificationCode: req.body.verificationCode != 'null'? req.body.verificationCode : null,
            isEmailVerified: req.body.isEmailVerified != 'null'? req.body.isEmailVerified : null,
            mobileNumber: req.body.mobileNumber != 'null'? req.body.mobileNumber : null,
            companyName: req.body.companyName != 'null'? req.body.companyName : null,
            designation: req.body.designation != 'null'? req.body.designation : null,
            whatsapp: req.body.whatsapp != 'null'? req.body.whatsapp : null,
            facebook: req.body.facebook != 'null'? req.body.facebook : null,
            instagram: req.body.instagram != 'null'? req.body.instagram : null,
            linkedin: req.body.linkedin != 'null'? req.body.linkedin : null,
            website: req.body.website != 'null'? req.body.website : null,
            city: req.body.city != 'null'? req.body.city : null,
            zipCode: req.body.zipCode != 'null'? req.body.zipCode : null,
            country: req.body.country != 'null'? req.body.country : null,
            state: req.body.state != 'null'? req.body.state : null,
            Address: req.body.address != 'null'? req.body.address : null,
            aboutMe: req.body.aboutMe != 'null'? req.body.aboutMe : null,
            youtube: req.body.youtube != 'null'? req.body.youtube : null,
            department: req.body.department != 'null'? req.body.department : null,
            vCardDetails: req.body.vCardDetails != 'null'? req.body.vCardDetails : null,
          };
        const cardupdation = await cardModel.updateCard(inputparam,cardId);
        if (!cardupdation)  return await helperUtil.responseSender(res,'error',400,responseObj, 'card updated. but waiting for response please contact BC');
        
        // if(!req.files.profilePhoto || req.files.coverPhoto) return await helperUtil.responseSender(res,'error',400,responseObj, 'File missing' );
        const images = await cardImageUpload(req, cardId,res);
        const cardcollection = await cardModel.getACard(cardId);
    if (!cardcollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'The cards not in active state');
        cardcollection.dataValues.images = images;
        responseObj = {"cardCollection" : cardcollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'Card Updated successfully');
    }catch(error){
        message = "card Updation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
});





var authenticateController=require('./controllers/authenticate');
const paymentModel = require("./models/mvc_payment.js");
const { now } = require("moment");

app.post('/api/authenticate',authenticateController.authenticate);

let server;

if (require.main === module) {
    server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = {
    app,
    start: () => {
        return new Promise((resolve, reject) => {
            server = app.listen(port, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Server running on port ${port}`);
                    resolve(server);
                }
            });
        });
    },
    stop: () => {
        return new Promise((resolve, reject) => {
            if (server) {
                server.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
};

// const express = require("express");
// const meth = require("method-override");
// const bodyParser = require("body-parser");
// const app = express();
// const upload = require('./middleware/upload');
// const exphbs = require("express-handlebars");
// var cors = require('cors')
// require('console-stamp')(console, '[yyyy-mm-dd HH:MM:ss.l]');
// app.use(cors());
// var multer = require('multer');
// var uploadFile = multer({dest:'./uploads/'});
// // require('aws-sdk/lib/maintenance_mode_message').suppress = true;

// var morgan = require('morgan')
// var fs = require('fs')
// var morgan = require('morgan')
// var path = require('path')

// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access'+ (new Date()).toISOString().slice(0,10)+'.log'), { flags: 'a' })

// // setup the logger
// app.use(morgan('combined', { immediate: false, stream: accessLogStream }));

// // environment variables
// process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// //process.env.NODE_ENV = 'testing';
// // process.env.NODE_ENV = 'staging';
// // process.env.NODE_ENV = 'staging';
// // process.env.NODE_ENV = 'production';
// // process.env.NODE_ENV = process.env.NODE_ENV || 'staging';

// // config variables
// const config = require('./config/config.js');

// const PORT = global.gConfig.node_port;

// app.use(express.static(__dirname + "/public"));
// console.log(__dirname,'DIR')
// app.use(function(req, res, next) {
//     // if (req.get('x-amz-sns-message-type')) {
//         req.headers['content-type'] = 'application/json';
//     // }
//     next();
// });

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// //app.use(uploadOne.array()); 
// app.use(uploadFile.any()); 


// //app.use(express.static('public'));
// //app.use(bodyParser.json());
// //app.get('/', function(req, res){
// //	res.render('form');
//  //});
 
//  //app.set('view engine', 'pug');
//  //app.set('views', './views');
 

// //  var productController = require("./controllers/product.js");
// // const productModel = require('./models/product.js');

// //app.post("/products/documents",uploadOne, function(req, res){
// const auth = require('./middleware/auth');
// var User = require("./controllers/user.js");
// console.log(User);
// app.use("/",User);



// app.listen(PORT,()=>{
// console.log(`post running with ${PORT}`);
// })