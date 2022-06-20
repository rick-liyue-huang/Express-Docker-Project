
const userDB = {
	users: require('../model/users.json'),
	setUsers: function (data) {
		this.users = data
	}
};

require('dotenv').config()
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginController = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
	const foundUser = userDB.users.find(person => person.username === username);
	if (!foundUser) return res.sendStatus(401); //Unauthorized
	// evaluate password
	const match = await bcrypt.compare(password, foundUser.password);
	if (match) {
		// create JWTs
		const accessToken = jwt.sign(
			{ "username": foundUser.username },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' }
		);
		const refreshToken = jwt.sign(
			{ "username": foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);
		// Saving refreshToken with current user
		const otherUsers = userDB.users.filter(person => person.username !== foundUser.username);
		const currentUser = { ...foundUser, refreshToken };
		userDB.setUsers([...otherUsers, currentUser]);
		await fsPromises.writeFile(
			path.join(__dirname, '..', 'model', 'users.json'),
			JSON.stringify(userDB.users)
		);
		res.cookie('jwt', refreshToken, {
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
