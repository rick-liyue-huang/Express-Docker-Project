
// config the Docker mongo service variables, and we should confirm in docker-compose.dev.yml file

module.exports = {
	MONGO_IP: process.env.MONGO_IP || 'mongo',
	MONGO_PORT: process.env.MONGO_PORT || 27017,
	MONGO_USER: process.env.MONGO_USER,
	MONGO_PASSWORD: process.env.MONGO_PASSWORD
}
