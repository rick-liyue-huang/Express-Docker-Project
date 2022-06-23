
const mongoose = require('mongoose');
const {MONGO_IP, MONGO_PASSWORD, MONGO_USER, MONGO_PORT} = require('./config');

const connectDB = async () => {
	try {

		await mongoose.connect(
			// process.env.MONGODB_URI,
			// for test: we have the custom ip address matching with docker-compose.yml mongo:
			`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`,
			{
				useUnifiedTopology: true,
				useNewUrlParser: true,
				// useFindAndModify: false
			}
		)

	} catch (err) {
		console.log(err);
	}
}

module.exports = {connectDB}
