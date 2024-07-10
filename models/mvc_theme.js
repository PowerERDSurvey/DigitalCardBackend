const themeRepo = require("../config/theme");

let themeModel = {
    getThemeById: async function(themeId){
        return await themeRepo.getThemeById(themeId);
    },
    createTheme: async function(inputparam){
        return await themeRepo.createTheme(inputparam);
    },
    updateTheme: async function(inputparam,themeId){
        return await themeRepo.updateTheme(inputparam,themeId);
    },
 }


module.exports = themeModel;