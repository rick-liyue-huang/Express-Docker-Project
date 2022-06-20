
require('dotenv').config();
const path = require('path');
const PORT = process.env.PORT || '3500';
const express = require('express');
const cors = require('cors');
const {logger} = require("./middlewares/logger");
const {errorHandler} = require("./middlewares/errorHandler");
const rootRouter = require('./routes/root');
const subRouter = require('./routes/subdir');
const {one, two, three} = require("./tests/tests");
const employeeRouter = require("./routes/api/employeeRouter");
const {corsOptions} = require("./config/corsOptions");


const app = express();


app.use(cors(corsOptions));

app.use(logger);

// built-in middlewares to handle urlencoded data, the form data will be 'Content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

// built-in middleware for response json format
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));


// router acted as middleware
app.use('/', rootRouter);
// app.use('/subdir', subRouter);
app.use('/api/employees', employeeRouter);

// test for middleware
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

app.listen(PORT, () => {
	console.log(`this server is listening on port of ${PORT}`);
});
