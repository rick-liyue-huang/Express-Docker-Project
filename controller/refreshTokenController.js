
const jwt = require('jsonwebtoken');
const {UserModel} = require("../model/User");

/*

const userDB = {
	users: require('../model/users.json'),
	setUsers: function (data) {
		this.users = data
	}
};

*/


const refreshTokenController = async (req, res) => {

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(401);
	const refreshToken = cookies.jwt;

	// for the refresh token strategy, we will clear the cookie after get the refreshtoken!!
	res.clearCookie('jwt', {
		httpOnly: true,
		sameSite: 'None',
		// secure: true
	});

	// const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
	const foundUser = await UserModel.findOne({refreshToken}).exec();

	// Detected refresh token reuse
	if (!foundUser) {

		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, decoded) => {
				if (err) {
					return res.sendStatus(403); //Forbidden
				}

				console.log('attempt to refresh token reuse!!!!!')

			//	here means somebody else try to use the valid refresh token other place
				const hackedUser = await UserModel.findOne({username: decoded.username}).exec();
				hackedUser.refreshToken = []; // delete all refresh tokens

				const result = await hackedUser.save();
				console.log('result: ', result);

			}
		)

		return res.sendStatus(403); //Forbidden
	}

	const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

	// evaluate jwt
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {

			// we got the refresh token, but it is the old one,
			if (err) {
				console.log('expired refresh token here...')
				foundUser.refreshToken = [...newRefreshTokenArray]; // if error, just delete the refresh token
				const result = await foundUser.save();
				console.log('result:', result)
			}

			// here the refresh token is expired
			if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

			// refresh token is still valid
			const roles = Object.values(foundUser.roles);

			const accessToken = jwt.sign(
				{
					'UserInfo': {
						'username': decoded.username,
						'roles': roles  // we can use jwt-decoded library in frontend
					}
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '300s' }
			);

			// after everything is fine, we get the new refresh token
			const newRefreshToken = jwt.sign(
				{ "username": foundUser.username },
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: '1d' }
			);
			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
			const result = await foundUser.save();

			// and get back the cookie jwt
			res.cookie('jwt', newRefreshToken, {
				httpOnly: true,
				sameSite: 'None',
				// secure: true,  // need to remove for postman
				maxAge: 24 * 60 * 60 * 1000 });

			// now here, we are rotating the tokens, we are deleting the old one we are getting the new one.
			// we are using the array of refresh tokens for multiple devices.
			res.json({ roles, accessToken })
		}
	);

}

module.exports = {refreshTokenController}
