const constants     = require(__basePath + '/app/config/constants');
const response      = require(constants.path.app + 'util/response');

require(constants.path.app + 'core/mysql_conn');

/**
 * Monitor Controller : Checking Server up/down
 *
 * @author Prerita Prajapati <preritaprajapati@>
 * @since Wed Jan 17 20:24:06 IST 2018
 */

exports.ping = function (req, res, next) {
return res.status(200).json(response.build('SUCCESS', [{response:'pong'}]));
}
