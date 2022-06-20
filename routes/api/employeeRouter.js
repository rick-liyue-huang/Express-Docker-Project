const path = require('path');
const express = require('express');
const employeeController = require("../../controller/employeeController");
const employeeRouter = express.Router();


employeeRouter
	.route('/')
	.get(employeeController.getAllEmployees)
	.post(employeeController.createNewEmployee)
	.put(employeeController.updateEmployee)
	.delete(employeeController.deleteEmployee);

employeeRouter
	.route('/:id')
	.get(employeeController.getSingleEmployee)


module.exports = employeeRouter;
