
// define the mock data

const data = {
	employees: require('../model/employees.json'),
	setEmployees: function (data) { this.employees = data }
}

const getAllEmployees = (req, res) => {
	res.json(data.employees);
}

const createNewEmployee = (req, res) => {
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

}

const updateEmployee = (req, res) => {
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
}

const deleteEmployee = (req, res) => {

	const deletedEmployee = data.employees.find(employee => employee.id === parseInt(req.body.id));
	if (!deletedEmployee) {
		return res.status(400).json({message: `Employee id ${req.body.id} not found`});
	}

	const filteredArray = data.employees.filter(employee => employee.id !== parseInt(req.body.id));
	data.setEmployees([...filteredArray]);
	res.json(data.employees);

};

const getSingleEmployee = (req, res) => {
	const foundEmployee = data.employees.find(employee => employee.id === parseInt(req.params.id));
	if (!foundEmployee) {
		return res.status(400).json({message: `Employee id ${req.params.id} not found`});
	}
	res.status(200).json(foundEmployee)
}


module.exports = {
	getAllEmployees,
	createNewEmployee,
	updateEmployee,
	deleteEmployee,
	getSingleEmployee
}
