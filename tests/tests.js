

const one = (req, res, next) => {
	console.log('one');
	next();
};

const two = (req, res, next) => {
	console.log('two');
	next();
}

const three = (req, res, next) => {
	console.log('three');
	res.send('finished');
}

module.exports = {one, two, three}
