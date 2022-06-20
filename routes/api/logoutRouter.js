
const express = require('express');
const {logoutController} = require("../../controller/logoutController");
const logoutRouter = express.Router();

logoutRouter.post('/', logoutController);

module.exports = logoutRouter
