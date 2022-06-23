
// config the Docker mongo service variables, and we should confirm in docker-compose.dev.yml file

module.exports = {
	MONGO_IP: process.env.MONGO_IP || 'mongo',
	MONGO_PORT: process.env.MONGO_PORT || 27017,
	MONGO_USER: process.env.MONGO_USER,
	MONGO_PASSWORD: process.env.MONGO_PASSWORD,
	REDIS_URL: process.env.REDIS_URL || 'redis',  // match with 'redis' in docker-compose.yml
	REDIS_PORT: process.env.REDIS_PORT || 6379,
	REDIS_SESSION_SECRET: process.env.REDIS_SESSION_SECRET || 'rickliyuehuang'
}
