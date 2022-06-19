
require('dotenv').config();
const path = require('path');
const PORT = process.env.PORT || '3500';
const express = require('express');
const cors = require('cors');
const {logger} = require("./middlewares/logger");
const {errorHandler} = require("./middlewares/errorHandler");



const app = express();

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
app.use(cors(corsOptions));

app.use(logger);

// built-in middlewares to handle urlencoded data, the form data will be 'Content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

// built-in middleware for response json format
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

const one = (req, res, next) => {
	console.log('one');
	next();
};

const two = (req, res, next) => {
	console.log('two');
	next();
}

const three = (req, res, next) => {
	console.log('three');
	res.send('finished');
}

app.get('^/$|/index(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

//
app.get('/old-page(.html)?', (req, res) => {
	res.redirect(301, '/new-page.html'); // 302 by default
});

app.get('/hello(.html)?',
	(req, res, next) => {
		console.log('attempt to handle hello.html');
		next(); // will go to the next route rule
	},
	(req, res) => {
		res.send('hello world');
	}
);


app.get('/chain(.html)?', [one, two, three]);

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
