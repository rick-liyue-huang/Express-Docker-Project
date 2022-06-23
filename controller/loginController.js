/*

const userDB = {
	users: require('../model/users.json'),
	setUsers: function (data) {
		this.users = data
	}
};
*/

require('dotenv').config()
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserModel} = require("../model/User");

const loginController = async (req, res) => {

	// modified here for refresh token rotation
	const cookies = req.cookies;
	console.log(`cookies available at login: ${JSON.stringify(cookies)}`)

	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ 'message': 'Username and password are required.' });
	}

	// const foundUser = userDB.users.find(person => person.username === username);
	const foundUser = await UserModel.findOne({username: username}).exec();

	if (!foundUser) {
		return res.sendStatus(401); //Unauthorized
	}
	// evaluate password
	const match = await bcrypt.compare(password, foundUser.password);


	if (match) {

		const roles = Object.values(foundUser.roles)

		// create JWTs
		const accessToken = jwt.sign(
			{
				'UserInfo': {
					'username': foundUser.username,
					'roles': roles
				}
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '600s' }
		);

		const newRefreshToken = jwt.sign(
			{ "username": foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		// Saving refreshToken with current user
		/*
		const otherUsers = userDB.users.filter(person => person.username !== foundUser.username);
		const currentUser = { ...foundUser, refreshToken };
		userDB.setUsers([...otherUsers, currentUser]);
		await fsPromises.writeFile(
			path.join(__dirname, '..', 'model', 'users.json'),
			JSON.stringify(userDB.users)
		);

		*/

		let newRefreshTokenArray =
			!cookies?.jwt
				?
				foundUser.refreshToken
				:
				foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

		if (cookies?.jwt) {

			/**
			 * scenario added here
			 * 1. user login but never use refresh token and doenot logout
			 * 2. refresh token is stolen
			 * 3. if 1 and 2, reuse detection is needed to clear all refresh tokens when user login again
			 */

			const refreshToken = cookies.jwt;
			const foundToken = await UserModel.findOne({refreshToken}).exec();

			// detected refresh token reuse
			if (!foundToken) {
				console.log('attempt to refresh token reuse at login');
				newRefreshTokenArray = [];
			}

			res.clearCookie('jwt', {
				httpOnly: true,
				sameSite: 'None',
				// secure: true
			});
		}


		// foundUser.refreshToken = refreshToken;
		foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

		const result = await foundUser.save();

		console.log('result: ', result);

		res.cookie('jwt', newRefreshToken, {
			httpOnly: true,
			sameSite: 'None',
			// secure: true,  // need to remove for postman
			maxAge: 24 * 60 * 60 * 1000 });
		res.json({ accessToken });

	} else {
		res.sendStatus(401); // means Unauthorized
	}

}

module.exports = {loginController}
