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
        User.create(
            {
                // ORG_ID:inputParams.ORG_ID,
                firstName:inputParams.FIRST_NAME,
                lastName:inputParams.LAST_NAME,
                password:inputParams.PASSWORD,
                email:inputParams.EMAIL
            }).then((user)=>{
                console.log('user'+user);
                cb(null, user);
            }).catch((err)=>{
                cb(err,null);
            });
        },
    update: async function(inputParams, cb){
        User.update(
            { lastName: 'Doe' },
            {
              where: {
                id: inputParams.id,
              },
            },
          ).then((user)=>{
            console.log('user'+user);
            cb(null, user);
        }).catch((err)=>{
            cb(err,null);
        });
    },
    getActiveEmails: function (cb) {
		var queryInputs = {
			attributes: ['email'],
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
    }
module.exports = users;