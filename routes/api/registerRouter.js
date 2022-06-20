
const express = require('express');
const registerRouter = express.Router();
const {registerController} = require('../../controller/registerController');

registerRouter
	.post('/', registerController);


module.exports = registerRouter;
