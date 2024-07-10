const { update } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var Theme = require('../models/theme')(sequelize, DataTypes);



let theme = {
    createTheme: async function (inputparam){
        const returnval = await Theme.create(inputparam);
        return returnval;
    },
    updateTheme: async function (inputparam, themeId){
        return await Theme.update(inputparam,{where:{id:themeId}});
    },
    getThemeById: async function (themeId){
        return await Theme.findOne({where:{id:themeId}});
    },
}


module.exports = theme;