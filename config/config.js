// requires
const _ = require('lodash');

// module variables
const config = require('./config.json');
const defaultConfig = config.testing;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfig = finalConfig;

// DB credentials will be assigned from OS environment variables

if (environment === 'development') {
    global.gConfig["db_username"] = process.env.DEVELOPMENT_DB_USER || global.gConfig["db_username"];
    global.gConfig["db_password"] = process.env.DEVELOPMENT_DB_PASSWORD || global.gConfig["db_password"];
    global.gConfig["db_schema"] = process.env.DEVELOPMENT_DB_SCHEMA || global.gConfig["db_schema"];
    global.gConfig["username"] = process.env.DEVELOPMENT_DB_USER || global.gConfig["username"];
    global.gConfig["password"] = process.env.DEVELOPMENT_DB_PASSWORD || global.gConfig["password"];
    global.gConfig["database"] = process.env.DEVELOPMENT_DB_SCHEMA || global.gConfig["database"];
} //if (environment === 'development') {

if (environment === 'testing') {
    global.gConfig["db_username"] = process.env.TESTING_DB_USER || global.gConfig["db_username"];
    global.gConfig["db_password"] = process.env.TESTING_DB_PASSWORD || global.gConfig["db_password"];
    global.gConfig["db_schema"] = process.env.TESTING_DB_SCHEMA || global.gConfig["db_schema"];
    global.gConfig["username"] = process.env.TESTING_DB_USER || global.gConfig["username"];
    global.gConfig["password"] = process.env.TESTING_DB_PASSWORD || global.gConfig["password"];
    global.gConfig["database"] = process.env.TESTING_DB_SCHEMA || global.gConfig["database"];
} //if (environment === 'testing') {

if (environment === 'staging') {
    global.gConfig["db_username"] = process.env.STAGING_DB_USER || global.gConfig["db_username"];
    global.gConfig["db_password"] = process.env.STAGING_DB_PASSWORD || global.gConfig["db_password"];
    global.gConfig["db_schema"] = process.env.STAGING_DB_SCHEMA || global.gConfig["db_schema"];
    global.gConfig["username"] = process.env.STAGING_DB_USER || global.gConfig["username"];
    global.gConfig["password"] = process.env.STAGING_DB_PASSWORD || global.gConfig["password"];
    global.gConfig["database"] = process.env.STAGING_DB_SCHEMA || global.gConfig["database"];
} //if (environment === 'staging') {

if (environment === 'production') {
    global.gConfig["db_username"] = process.env.PRODUCTION_DB_USER || global.gConfig["db_username"];
    global.gConfig["db_password"] = process.env.PRODUCTION_DB_PASSWORD || global.gConfig["db_password"];
    global.gConfig["db_schema"] = process.env.PRODUCTION_DB_SCHEMA || global.gConfig["db_schema"];
    global.gConfig["username"] = process.env.PRODUCTION_DB_USER || global.gConfig["username"];
    global.gConfig["password"] = process.env.PRODUCTION_DB_PASSWORD || global.gConfig["password"];
    global.gConfig["database"] = process.env.PRODUCTION_DB_SCHEMA || global.gConfig["database"];
} //if (environment === 'production') {

if (environment === 'devprod') {
    global.gConfig["db_username"] = process.env.DEVPROD_DB_USER || global.gConfig["db_username"];
    global.gConfig["db_password"] = process.env.DEVPROD_DB_PASSWORD || global.gConfig["db_password"];
    global.gConfig["db_schema"] = process.env.DEVPROD_DB_SCHEMA || global.gConfig["db_schema"];
    global.gConfig["username"] = process.env.DEVPROD_DB_USER || global.gConfig["username"];
    global.gConfig["password"] = process.env.DEVPROD_DB_PASSWORD || global.gConfig["password"];
    global.gConfig["database"] = process.env.DEVPROD_DB_SCHEMA || global.gConfig["database"];
} //if (environment === 'devprod') {

if (environment === 'testprod') {
    global.gConfig["db_username"] = process.env.TESTPROD_DB_USER || global.gConfig["db_username"];
    global.gConfig["db_password"] = process.env.TESTPROD_DB_PASSWORD || global.gConfig["db_password"];
    global.gConfig["db_schema"] = process.env.TESTPROD_DB_SCHEMA || global.gConfig["db_schema"];
    global.gConfig["username"] = process.env.TESTPROD_DB_USER || global.gConfig["username"];
    global.gConfig["password"] = process.env.TESTPROD_DB_PASSWORD || global.gConfig["password"];
    global.gConfig["database"] = process.env.TESTPROD_DB_SCHEMA || global.gConfig["database"];
} //if (environment === 'testprod') {

if (environment === 'whatsapp') {
    global.gConfig["db_username"] = process.env.WHATSAPP_DB_USER || global.gConfig["db_username"];
    global.gConfig["db_password"] = process.env.WHATSAPP_DB_PASSWORD || global.gConfig["db_password"];
    global.gConfig["db_schema"] = process.env.WHATSAPP_DB_SCHEMA || global.gConfig["db_schema"];
    global.gConfig["username"] = process.env.WHATSAPP_DB_USER || global.gConfig["username"];
    global.gConfig["password"] = process.env.WHATSAPP_DB_PASSWORD || global.gConfig["password"];
    global.gConfig["database"] = process.env.WHATSAPP_DB_SCHEMA || global.gConfig["database"];
} //if (environment === 'whatsapp') {

// log global.gConfig
console.log(`global.gConfig: ${JSON.stringify(global.gConfig, undefined, global.gConfig.json_indentation)}`);