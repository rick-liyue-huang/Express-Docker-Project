/*

const userDB = {
	users: require('../model/users.json'),
	setUsers: function (data) {
		this.users = data
	}
};
*/

// replace the mock data with MongoDB
const {UserModel} = require('../model/User');
const fsPromise = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');


const registerController = async (req, res) => {
	const {username, password} = req.body;
	if (!username || !password) {
		return res.status(400).json({message: 'Username or password are required in register'});
	}

//	check the duplicated username in DB
	// const duplicatedUser = userDB.users.find(person => person.username === username);
	const duplicatedUser = await UserModel.findOne({username: username}).exec();

	if (duplicatedUser) {
		return res.sendStatus(409); // means conflict
	}

	// in async func, must use try-catch
	try {

	//	encrypt password
		const hashedPassword = await bcrypt.hash(password, 10);
	//	store the user in DB
		/*
		const newUser = {
			// get user by name, so do not need id
			username: username,
			password: hashedPassword,
			roles: {User: 2000} // add roles
		};

		await fsPromise.writeFile(
			path.join(__dirname, '..', 'model', 'users.json'),
			JSON.stringify(userDB.users)
		)
		console.log(userDB.users);
		userDB.setUsers([...userDB.users, newUser]);

		*/

		const result = await UserModel.create({
			'username': username,
			'password': hashedPassword,
			// 'roles': {User: 2000} // it will add automatically
		});

		/**
		 * @define  store the user info in session
		 */
		req.session.user = result; 

		console.log('result: ', result);

		res.status(201).json({message: `new user ${username} registered.`})

	} catch (err) {
		res.status(500).json({message: err.message});
	}
}


module.exports = {
	registerController
}
