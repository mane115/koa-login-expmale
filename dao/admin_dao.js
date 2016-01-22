var dao = require('../dataBase.js');
var Admin = dao.getModel('Admin');

var createTest = function() {
	var entity = new Admin({
		accountName: 'admin',
		password: 'admin'
	});
	console.log('dao')
	return new Promise((success, fail) => {
		entity.save(function(e, data) {
			console.log(data);
			success('test')
			return 'test'
		})
	})
}
var test = function(arg) {
	return new Promise((success, fail) => {
		console.log(arg, ":this is dao.test")
		success()
	})
}
module.exports = {
	createTest,
	test
}