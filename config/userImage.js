const { update } = require('lodash');
const fs = require('fs');
const { Sequelize, DataTypes, where } = require('sequelize');

const sequelize = new Sequelize(global.gConfig.database, global.gConfig.username, global.gConfig.password, {
	host: global.gConfig.host,
	dialect: global.gConfig.dialect /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});

// import userImage from ('../models/userimage')(sequelize, DataTypes);
var userImage = require('../models/userimage')(sequelize, DataTypes);

let userImages = {
    createByUserId: async function (inputparam,Itype,user ) {
        var createUserImage={};
        const fileData = fs.readFileSync(inputparam.path);
        const fileBlob = Buffer.from(fileData, 'binary');
        try {
            const getUserImage = await this.getUserImageByIdandType(user,Itype);
    
            if (!getUserImage) {
                createUserImage =await  userImage.create({
                    filename: inputparam.filename,
                    filepath: inputparam.path,
                      type: Itype,
                      userId: user,
                      data:fileBlob,
                })
            }
            else{
                createUserImage = await userImage.update({
                    filename: inputparam.filename,
                    filepath: inputparam.path,
                    data:fileBlob,
                }, {
                    where: {
                        userId: getUserImage.userId,
                        type: getUserImage.type
                    },
                    returning: true,
                });
            }
        
            const reurnVal = await this.getUserImageByIdandType(user,Itype);
                return reurnVal;
            
        } catch (error) {
            throw new Error('Image upload failed: ' + error.message);
        }
       
        
    },
    getUserimageById: async function (user) {
        const getUserImage = await userImage.findOne({where:{userId: user}});
        return getUserImage;
    },
    getALLUserimageById: async function (user) {
        const getUserImage = await userImage.findAll({where:{userId: user}});
        return getUserImage;
    },
    getUserImageByIdandType:async function (user, Itype) {
        const returnVal = await userImage.findOne({ where: { userId: user, type: Itype} });
        return returnVal;
    }
}

module.exports = userImages;