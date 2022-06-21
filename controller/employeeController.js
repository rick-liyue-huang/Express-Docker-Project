
// define the mock data
/*

const data = {
	employees: require('../model/employees.json'),
	setEmployees: function (data) { this.employees = data }
}
*/


const {EmployeeModel} = require("../model/Employee");
const getAllEmployees = async (req, res) => {
	// res.json(data.employees);

	const employees = await EmployeeModel.find();

	if (!employees) {
		return res.status(204).json({message: 'no employees'});
	}
	res.json({employees});

}

const createNewEmployee = async (req, res) => {
	/*
	const newEmployee = {
		id: data.employees[data.employees.length - 1].id + 1 || 1,
		firstname: req.body.firstname,
		lastname: req.body.lastname
	}


	if (!newEmployee.firstname || !newEmployee.lastname) {
		return res.status(400).json({message: 'first or last name needed'});
	}

	data.setEmployees([...data.employees, newEmployee]);
	res.status(201).json(data.employees);

	*/

	if (!req?.body?.firstname || !req?.body?.lastname) {
		return res.status(400).json({message: 'first or last name needed'});
	}

	try {

		const result = await EmployeeModel.create({
			'firstname': req.body.firstname,
			'lastname': req.body.lastname
		});

		res.status(201).json(result);

	} catch (err) {
		console.log(err);
	}

}

const updateEmployee = async (req, res) => {
	/*
	const foundEmployee = data.employees.find(employee => employee.id === parseInt(req.body.id));
	if (!foundEmployee) {
		return res.status(400).json({message: `employee id ${req.body.id} not found`})
	}
	if (req.body.firstname) {
		foundEmployee.firstname = req.body.firstname;
	}
	if (req.body.lastname) {
		foundEmployee.lastname = req.body.lastname;
	}
	const filteredArray = data.employees.filter(employee => employee.id !== parseInt(req.body.id));

	const unsortedArray = [...filteredArray, foundEmployee];
	data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
	res.json(data.employees);
	*/

	if (!req?.body?.firstname || !req?.body?.lastname) {
		return res.status(400).json({message: `employee id ${req.body.id} not found`})
	}

	const employee = await EmployeeModel.findOne({
		_id: req.body.id
	}).exec();

	if (!employee) {
		return res.status(400).json({message: `employee id ${req.body.id} not found`})
	}

	if (req.body.firstname) {
		employee.firstname = req.body.firstname;
	}

	if (req.body.lastname) {
		employee.lastname = req.body.lastname;
	}

	const result = await employee.save();
	res.json(result);

}

const deleteEmployee = async (req, res) => {
	/*

	const deletedEmployee = data.employees.find(employee => employee.id === parseInt(req.body.id));
	if (!deletedEmployee) {
		return res.status(400).json({message: `Employee id ${req.body.id} not found`});
	}

	const filteredArray = data.employees.filter(employee => employee.id !== parseInt(req.body.id));
	data.setEmployees([...filteredArray]);
	res.json(data.employees);
	*/

	if (!req?.body?.id) {
		return res.status(400).json({message: `Employee id ${req.body.id} not found`})
	}

	const deletedEmployee = await EmployeeModel.findOne({_id: req.body.id}).exec();
	if (!deletedEmployee) {
		return res.status(400).json({message: `Employee id ${req.body.id} not found`});
	}

	const result = await EmployeeModel.deleteOne({_id: req.body.id});  // no exec here
	res.json(result);

};

const getSingleEmployee = async (req, res) => {
	/*
	const foundEmployee = data.employees.find(employee => employee.id === parseInt(req.params.id));
	if (!foundEmployee) {
		return res.status(400).json({message: `Employee id ${req.params.id} not found`});
	}
	res.status(200).json(foundEmployee)
	*/

	if (!req?.params?.id) {
		return res.status(400).json({message: `Employee id ${req.params.id} not found`})
	}

	const foundEmployee = await EmployeeModel.findOne({_id: req.params.id}).exec();
	if (!foundEmployee) {
		return res.status(400).json({message: `Employee id ${req.params.id} not found`});
	}

	res.json(foundEmployee);

}


module.exports = {
	getAllEmployees,
	createNewEmployee,
	updateEmployee,
	deleteEmployee,
	getSingleEmployee
}
