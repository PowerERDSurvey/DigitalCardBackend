const { db } = require('../models/index');
var User = require('../models/user')(sequelize, DataTypes);

let users = {
    create: async function (inputParams, cb) {
        User.create(
            {
                ORG_ID:inputParams.ORG_ID,
                FIRST_NAME:inputParams.FIRST_NAME,
                LAST_NAME:inputParams.LAST_NAME,
                PASSWORD:inputParams.PASSWORD,
                EMAIL:inputParams.EMAIL
            }).then((user)=>{

            }).catch((err)=>{

            });
        }
    }
    module.exports = users;