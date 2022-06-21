
const {Schema, model} = require('mongoose');

const userSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	roles: {
		User: {
			type: Number,
			default: 2000
		},
		Editor: {
			type: Number,
		},
		Admin: {
			type: Number,
		}
	},
	password: {
		type: String,
		required: true
	},
	refreshToken: String,
});

const UserModel = model('User', userSchema);

module.exports = {UserModel};
