const express=require("express");
const cors=require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
// const config = require('./config/dbConfig');
var path = require('path');
global.__basedir = __dirname ;
var multer = require('multer');
var uploadFile = multer({dest:'./uploads/'});
const config = require('./config/config.js');
const helperUtil = require('./util/helper.js')
const port = process.env.PORT || 8080;
const cardModel = require("./models/mvc_Businesscard");

const cardImageModel = require("./models/mvc_businessCardImage.js");
const auth = require('./middleware/auth.js');
const userModel = require("./models/mvc_User");

const userImageModel = require("./models/mvc_UserImage.js");
// const helperUtil = require('./util/helper.js');

const upload = require('./middleware/upload.js');
// var bodyParser = require('body-parser').json();

const auth = require('./middleware/auth.js');
const userModel = require("./models/mvc_User");
const helperUtil = require('./util/helper.js');

const upload = require('./middleware/upload.js');
// var bodyParser = require('body-parser').json();

var corsoption ={
    origin : 'http://localhost:3000'
}
const app=express();


// app.use(express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(__dirname + "/public"));
console.log(__dirname,'DIR')
// app.use(function(req, res, next) {
//     if (req.get('x-amz-sns-message-type')) {
//         req.headers['content-type'] = 'application/json';
//     }
//     next();
// });

//midleware

app.use(cors(corsoption));
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

app.put("/user/:ID",auth,upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]), async function (req, res) {

    try {
   

    var UserId = req.params.ID;
    // var requestBody =  req.body;
    var requestBody =  {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        primaryEmail: req.body.primaryEmail,
        secondaryEmail: req.body.secondaryEmail,
        isActive: req.body.isActive,
        verificationCode: req.body.verificationCode,
        isEmailVerified: req.body.isEmailVerified,
        mobileNumber: req.body.mobileNumber,
        companyName: req.body.companyName,
        designation: req.body.designation,
        whatsapp: req.body.whatsapp,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        linkedin: req.body.linkedin,
        website: req.body.website,
        city: req.body.city,
        zipCode: req.body.zipCode,
        country: req.body.country,
        state: req.body.state,
        Address: req.body.address,
        aboutMe: req.body.aboutMe,
        youtube: req.body.youtube,
        department: req.body.department,
        role:req.body.role,
        companyId:req.body.companyId
      };
      var message = "";
      var httpStatusCode = 500;
      var responseObj = {};
      if (!UserId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');


        const userUpdate = await userModel.update(UserId, requestBody);
        if(!userUpdate) return await helperUtil.responseSender(res,'error',400,responseObj, 'user updated. but waiting for response please contact BC');
        
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
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
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
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            primaryEmail: req.body.primaryEmail,
            secondaryEmail: req.body.secondaryEmail,
            isActive: req.body.isActive,
            verificationCode: req.body.verificationCode,
            isEmailVerified: req.body.isEmailVerified,
            mobileNumber: req.body.mobileNumber,
            companyName: req.body.companyName,
            designation: req.body.designation,
            whatsapp: req.body.whatsapp,
            facebook: req.body.facebook,
            instagram: req.body.instagram,
            linkedin: req.body.linkedin,
            website: req.body.website,
            city: req.body.city,
            zipCode: req.body.zipCode,
            country: req.body.country,
            state: req.body.state,
            Address: req.body.address,
            aboutMe: req.body.aboutMe,
            youtube: req.body.youtube,
            department: req.body.department,
            vCardDetails: req.body.vCardDetails,
          };
        const cardupdation = await cardModel.updateCard(inputparam,cardId);
        if (!cardupdation)  return await helperUtil.responseSender(res,'error',400,responseObj, 'card updated. but waiting for response please contact BC');
        
        // if(!req.files.profilePhoto || req.files.coverPhoto) return await helperUtil.responseSender(res,'error',400,responseObj, 'File missing' );
        const images = [];
        if(req.files.profilePhoto ) {
            const profileImage =await cardImageModel.createByCardId(req.files.profilePhoto[0],"profilePhoto",cardId);
            images.push(profileImage);
        }
        if (req.files.coverPhoto) {
            const coverPhoto = req.files.coverPhoto[0];
            const coverImage =await cardImageModel.createByCardId(coverPhoto,"coverPhoto",cardId);
           images.push(coverImage);
        }

        const cardcollection = await cardModel.getACard(cardId);
        if (!cardcollection)  return await helperUtil.responseSender(res,'error',400,responseObj, 'The cards not in active state');
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