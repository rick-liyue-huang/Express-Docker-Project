
const express = require('express');
const loginRouter = express.Router();
const {loginController} = require('../../controller/loginController');

loginRouter.post('/', loginController);


module.exports = loginRouter;
