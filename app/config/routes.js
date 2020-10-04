const constant = require(__basePath + 'app/config/constants');
const config   = require(constant.path.app + 'core/configuration');

module.exports = function (app) {
    //Setting dependencies
    app.set('di', {
        constant: constant,
        config  : config
    });
    app.use('/monitor', require(constant.path.module + 'monitor').router);
    app.use('/', require(constant.path.module + 'class').router);
};