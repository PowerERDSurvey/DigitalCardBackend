const { update } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var Theme = require('../models/theme')(sequelize, DataTypes);



let theme = {
    createTheme: async function (inputparam) {
        const returnval = await Theme.create(inputparam);
        return returnval;
    },
    updateTheme: async function (inputparam, themeId) {
        await Theme.update(inputparam, { where: { id: themeId } });
        return await this.getThemeById(themeId);
    },
    getThemeById: async function (themeId) {
        return await Theme.findOne({ where: { id: themeId } });
    },
    getThemeByCardId: async function (cardId) {
        return await Theme.findOne({ where: { cardId: cardId } });
    },
}


module.exports = theme;