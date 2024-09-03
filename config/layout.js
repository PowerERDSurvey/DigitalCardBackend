const { update, random } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var Layout = require('../models/layout')(sequelize, DataTypes);
let layout = {
    createLayout: async function(inputparam){
        const returnVal = await Layout.create(inputparam);
        return returnVal;
    },
    updateLayout: async function(inputparam, layoutId){
        const UpadtedLayout = await Layout.update(inputparam,{where:{
            id:layoutId
        }} );


        return await this.getLayout(layoutId);
    },
    getLayout: async function(layoutId){
        const returnVal = await Layout.findOne({
            where:{
                id: layoutId
            }
        });
        return returnVal;

    },
    getAllLayout: async function(){
        // {where:{
        //     isActive:true
        // }}
        const returnVal = await Layout.findAll();
        return returnVal;

    },
    activateOrDeactivate:async function(layoutId, is_active){
        const returnVal = await Layout.update(
            {
                isActive: is_active
              },
              {
                where: {
                  id: layoutId,
                },
              }
        )
        return returnVal;
    },
}

module.exports = layout;
