const constant      = require(__basePath + 'app/config/constants');
const config        = require(constant.path.app + 'core/configuration');
const NodeException = require("node-exceptions");

class ApplicationException extends NodeException.LogicalException {
	constructor (ERROR_KEY = 'ERROR_SERVER_ERROR') {
		super();
        const error     = config.get(`APP_MESSAGES:${ERROR_KEY}`);
        this.message    = error.message;
        this.status     = error.statusCode;
        this.code       = error.errorCode;
        this.response   = this.response || {};
	}
}

/*
 * Error Handler 
 */
const errorHandler = function (err, req, res, next) {

    return res.status(err.status || 500).json({
        status       : false,
        statusMessage: err.message,
        statusCode   : err.code,
        response     : err.response
    });
};

module.exports = {
    errorHandler                    : errorHandler
};