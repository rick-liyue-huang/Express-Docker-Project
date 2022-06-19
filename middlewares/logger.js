
const {logEvent} = require('../utils/logEvent');

const logger = (req, res, next) => {
	logEvent(`${req.method} -- ${req.headers.orgin} -- ${req.url}`, 'reqLog.txt');
	next();
}

module.exports = {logger}
