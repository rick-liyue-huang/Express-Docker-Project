
require('dotenv').config();
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');
const {UserModel} = require("../model/User");

/*

const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) {
		this.users = data
	}
};
*/



const logoutController = async (req, res) => {
	// On client, also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); //No content
	const refreshToken = cookies.jwt;

	// Is refreshToken in db?
	// const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
	const foundUser = await UserModel.findOne({refreshToken: refreshToken}).exec();

	if (!foundUser) {
		res.clearCookie('jwt', {
			httpOnly: true,
			sameSite: 'None',
			// secure: true
		});
		return res.sendStatus(204);
	}

	// Delete refreshToken in db
	/*
	const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
	const currentUser = { ...foundUser, refreshToken: '' };
	usersDB.setUsers([...otherUsers, currentUser]);
	await fsPromises.writeFile(
		path.join(__dirname, '..', 'model', 'users.json'),
		JSON.stringify(usersDB.users)
	);
*/

	// delete refresh token in DB
	// foundUser.refreshToken = '';
	foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
	// update the document with save
	const result = await foundUser.save();

	console.log('result: ', result);

	res.clearCookie('jwt', {
		httpOnly: true,
		sameSite: 'None',
		// secure: true
	});
	res.sendStatus(204);
}

module.exports = {logoutController}
