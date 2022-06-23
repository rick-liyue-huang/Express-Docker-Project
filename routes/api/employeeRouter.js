const path = require('path');
const express = require('express');
const employeeController = require("../../controller/employeeController");
const employeeRouter = express.Router();
const {RolesList} = require('../../config/rolesList');
const {verifyRoles} = require('../../middlewares/VerifyRoles');


employeeRouter
	.route('/')
	.get(employeeController.getAllEmployees)
	// .post(verifyRoles(RolesList.Admin, RolesList.Editor), employeeController.createNewEmployee)
	// .put(verifyRoles(RolesList.Admin, RolesList.Editor), employeeController.updateEmployee)
	// .delete(verifyRoles(RolesList.Admin), employeeController.deleteEmployee);
	.post(employeeController.createNewEmployee)
	.put(employeeController.updateEmployee)
	.delete(employeeController.deleteEmployee);

employeeRouter
	.route('/:id')
	.get(employeeController.getSingleEmployee)


module.exports = employeeRouter;
