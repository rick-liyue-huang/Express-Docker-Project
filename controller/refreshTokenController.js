
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

	// const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
	const foundUser = await UserModel.findOne({refreshToken}).exec();

	if (!foundUser) return res.sendStatus(403); //Forbidden

	// evaluate jwt
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		(err, decoded) => {
			if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

			const roles = Object.values(foundUser.roles);

			const accessToken = jwt.sign(
				{
					'UserInfo': {
						'username': decoded.username,
						'roles': roles
					}
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '300s' }
			);
			res.json({ accessToken })
		}
	);

}

module.exports = {refreshTokenController}
