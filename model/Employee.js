
const {Schema, model} = require('mongoose');

const employeeSchema = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	}
});

const EmployeeModel = model('Employee', employeeSchema);


module.exports = {EmployeeModel}
