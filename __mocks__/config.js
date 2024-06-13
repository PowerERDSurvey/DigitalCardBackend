// __mocks__/config.js
const _ = require('lodash');

// Mock configuration
const config = {
    development: {
        database: "DigitalCard",
        db_host: "localhost",
        db_port: "3306",
        db_username: "root",
        db_password: "Babish@1998",
        db_schema: "DigitalCard",
        username: "root",
        password: "Babish@1998",
        host: "localhost",
        dialect: "mysql",
        migrationStorage: "sequelize",
        seederStorage: "sequelize"
    },
    test: {
        database: "DigitalCardTest",
        db_host: "localhost",
        db_port: "3306",
        db_username: "root",
        db_password: "Babish@1998",
        db_schema: "DigitalCardTest",
        username: "root",
        password: "Babish@1998",
        host: "localhost",
        dialect: "mysql",
        migrationStorage: "sequelize",
        seederStorage: "sequelize"
    },
    production: {
        username: "root",
        password: null,
        database: "database_production",
        host: "127.0.0.1",
        dialect: "mysql"
    }
};

const defaultConfig = config.testing;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// Set global config
global.gConfig = finalConfig;

module.exports = finalConfig;
