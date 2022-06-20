
// Cross-origin resource sharing
const whiteList = ['https://www.google.com', 'https://www.your-site.com', 'http://127.0.0.1:3500', 'http://localhost:3500'];
const corsOptions = {
	origin: (origin, callback) => {
		if (whiteList.indexOf(origin) !== -1 || !origin) {
			callback(null, true) // null for error, and true for 'yes it is same origin'
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	optionsSuccessStatus: 200
}

module.exports = {corsOptions}
