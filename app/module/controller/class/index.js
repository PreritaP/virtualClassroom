const constants   = require(__basePath + 'app/config/constants');
const router      = require('express').Router({
    caseSensitive: true,
    strict       : true
});

const classCon       = require(constants.path.module + 'class/classController');

router.post('/addVisitor', classCon.addVisitor);
router.post('/classAction', classCon.classAction);
router.get('/leaveClass/:id', classCon.leaveClass);
router.get('/showClassHistory/:classRoom', classCon.showClassHistory);

module.exports = { router: router };