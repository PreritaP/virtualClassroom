const nconf   = require('nconf');
const nodeEnv = process.env.NODE_ENV || 'development';

nconf.argv().env();
nconf.file('config', __basePath + `app/config/config.${nodeEnv}.json`);
nconf.file('responseMessage', __basePath + 'app/config/responseMessages.json');

module.exports = nconf;