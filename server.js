
require('dotenv').config();
const path = require('path');
const PORT = process.env.PORT || '3500';
const express = require('express');


const app = express();

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
	res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});



app.listen(PORT, () => {
	console.log(`this server is listening on port of ${PORT}`);
});
