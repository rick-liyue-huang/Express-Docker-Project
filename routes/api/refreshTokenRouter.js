
const express = require('express');
const {refreshTokenController} = require("../../controller/refreshTokenController");
const refreshTokenRouter = express.Router();


refreshTokenRouter.get('/', refreshTokenController);


module.exports = refreshTokenRouter;
