
const sessionAuthMiddleware = (req, res, next) => {

	// match with 'req.session.user = foundUser;' in loginController
	const {user} = req.session;
	console.log('user----', user);

	if (!user) {
		return res.status(401).json({message: 'no user info from session'});
	}

	// compare with verifyJWT.js middleware
	req.user = user.username;
	req.roles = user.roles;
	req.roles = Object.values(req.roles);  // {} => []
	console.log('req.roles: ----', req.roles);

	next();
}
module.exports = {sessionAuthMiddleware};
