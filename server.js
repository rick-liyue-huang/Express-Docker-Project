
require('dotenv').config();
const path = require('path');
const PORT = process.env.PORT || '3500';
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {logger} = require("./middlewares/logger");
const {errorHandler} = require("./middlewares/errorHandler");
const rootRouter = require('./routes/root');
const subRouter = require('./routes/subdir');
const {one, two, three} = require("./tests/tests");
const employeeRouter = require("./routes/api/employeeRouter");
const {corsOptions} = require("./config/corsOptions");
const registerRouter = require("./routes/api/registerRouter");
const loginRouter = require("./routes/api/loginRouter");
const {verifyJWT} = require("./middlewares/verifyJWT");
const refreshTokenRouter = require("./routes/api/refreshTokenRouter");
const logoutRouter = require("./routes/api/logoutRouter");
const {credentialsMiddleware} = require("./middlewares/credentialsMiddleware");
const mongoose = require('mongoose');
const {connectDB} = require('./config/mongoCon');
const fileUpload = require('express-fileupload');
const {filesPayloadExists} = require("./middlewares/filesPayloadExists");
const {fileExtensionLimit} = require("./middlewares/fileExtensionLimit");
const {fileSizeLimit} = require("./middlewares/fileSizeLimit");

// connect with mongoDB
connectDB();



const app = express();

app.use(logger);

// deal with the problems of 'Access-Control-Allow-Credentials'
app.use(credentialsMiddleware);

app.use(cors(corsOptions));

// built-in middlewares to handle urlencoded data, the form data will be 'Content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

// built-in middleware for response json format
app.use(express.json());

// middleware for cookie
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));

// router acted as middleware
app.use('/', rootRouter);
app.use('/subdir', subRouter);

app.use('/api/register', registerRouter);
app.use('/api/auth', loginRouter);

// get access token from refresh token
app.use('/api/refresh', refreshTokenRouter);
app.use('/api/logout', logoutRouter);

app
	.post(
	'/upload',
		fileUpload({createParentPath: true}),
		filesPayloadExists,
		fileExtensionLimit(['.png', '.jpg', '.jpeg', '.svg']),
		fileSizeLimit,
		(req, res) => {
			const files = req.files;

			Object.keys(files).forEach(key => {
				const filepath = path.join(__dirname, 'files', files[key].name);
				files[key].mv(filepath, (err) => {
					if (err) {
						return res.status(500).json({status: 'error', message: err})
					}

				})
			})


			console.log(files);

			return res.json({status: 'success', message: Object.keys(files).toString()});

		}
	)

// add jwt middleware in employees router
// app.use(verifyJWT);
app.use('/api/employees', verifyJWT, employeeRouter);

// test for middleware
/*

app.get('/chain(.html)?', [one, two, three]);
app.get('/hello(.html)?',
	(req, res, next) => {
		console.log('attempt to handle hello.html');
		next(); // will go to the next route rule
	},
	(req, res) => {
		res.send('hello world');
	}
);
*/



// handle other no config route
app.get('*', (req, res) => {
	res.status(404);
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	}
	else if (req.accepts('json')) {
		res.json({error: '404 not found'})
	}
	else {
		res.type('txt').send('404 not found')
	}
});


// use custom error handler
app.use(errorHandler);

mongoose.connection.once('open', () => {
	console.log(`connected with MongoDB successfully!!!`);

	app.listen(PORT, () => {
		console.log(`this server is listening on port of ${PORT}`);
	});

});


