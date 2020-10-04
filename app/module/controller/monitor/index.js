const constants   = require(__basePath + 'app/config/constants');
const router     = require('express').Router({
    caseSensitive: true,
    strict       : true
});
const monitor      = require(constants.path.module + 'monitor/monitorController');

router.get(
    '/ping',
    monitor.ping
);


module.exports = {
    router: router
};