const constant  = require(__basePath + 'app/config/constants');
const config    = require(constant.path.app + 'core/configuration');
const exception = require("node-exceptions");
const response  = {};

response.build = function (key, response) {
    const responseObj = config.get("APP_MESSAGES:" + key);

    return {
        status       : key === 'SUCCESS',
        statusCode   : responseObj.errorCode,
        statusMessage: responseObj.message,
        response     : response || {}
    };
};

response.error = function (key, exceptionClass = 'LogicalException') {
    const responseObj = config.get("APP_MESSAGES:" + key);
    return new exception[exceptionClass](responseObj.message, responseObj.statusCode, responseObj.errorCode);
};

module.exports = response;