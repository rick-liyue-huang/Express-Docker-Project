const path =  require("path");
const express = require('express');
const rooRouter = express.Router();



rooRouter.get('^/$|/index(.html)?', (req, res) => {
	return res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});
/*

rooRouter.get('/new-page(.html)?', (req, res) => {
	return res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

//
rooRouter.get('/old-page(.html)?', (req, res) => {
	return res.redirect(301, '/new-page.html'); // 302 by default
});
*/


module.exports = rooRouter
