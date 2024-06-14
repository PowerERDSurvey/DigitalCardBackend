const { update } = require('lodash');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(global.gConfig.database, global.gConfig.username, global.gConfig.password, {
	host: global.gConfig.host,
	dialect: global.gConfig.dialect /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
var User = require('../models/user')(sequelize, DataTypes);

let users = {
    create: async function (inputParams, cb) {
        console.log('inputParams'+inputParams);
        
        User.create(inputParams).then((user)=>{
                console.log('user'+user);
                cb(null, user);
            }).catch((err)=>{
                cb(err,null);
            });
        },
    update: async function(UserId,inputParams, cb){
        User.update(

            { firstName: inputParams.firstName,
                lastName: inputParams.lastName,
                primaryEmail: inputParams.primaryEmail,
                SecondryEmail: inputParams.SecondryEmail,
                isActive: inputParams.isActive,
                verificationCode: inputParams.verificationCode,
                isEmailVerified: inputParams.isEmailVerified,
                mobileNumber: inputParams.mobileNumber,
                companyName: inputParams.companyName,
                designation: inputParams.designation,
                whatsapp: inputParams.whatsapp,
                facebook: inputParams.facebook,
                instagram: inputParams.instagram,
                linkedin: inputParams.linkedin,
                website: inputParams.website,
                city: inputParams.city,
                zipCode: inputParams.zipCode,
                country: inputParams.country,
                state: inputParams.state,
              Address: inputParams.address,
              youtube:inputParams.youtube
            },
            {
              where: {
                id: UserId,
              },
              returning: true, 
            },
          ).then(() => {
            return User.findOne({ where: { id: UserId } }); // Fetch the updated user
          })
          .then((updatedUser) => {
            console.log('Updated user:', updatedUser);
            cb(null, updatedUser);
          })
          .catch((err) => {
            cb(err, null);
          });
    },
    getActiveEmails: function (cb) {
		var queryInputs = {
			// attributes: ['email'],
			where: {
			  IsActive: true, 
			}
		   };
		   
		  
		User.findAll(queryInputs).then((email_addresses)=>{
		  cb(null, email_addresses);
		}).catch((err)=>{
		  cb(err, null);
		});
  
	   },
       getActivePassword: function (cb) {
		var queryInputs = {
			attributes: ['password'],
			where: {
			  IsActive: true, 
			}
		   };
		   
		  
		User.findAll(queryInputs).then((password)=>{
		  cb(null, password);
		}).catch((err)=>{
		  cb(err, null);
		});
  
	   },
       getOneUser: function (userId,cb) {
        User.findOne({
            where: { id: userId},
            rejectOnEmpty: true,
          }).then((user)=>{
            cb(null, user);
          }).catch((err)=>{
            cb(err, null);
          });
       },
    }
module.exports = users;