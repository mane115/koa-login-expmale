var dao = require('../models/dataBase.js'),
	Admin = dao.getModel('Admin'),
	User = dao.getModel('User');
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
var findAccount = function() {
	return new Promise((success, fail) => {
		User.find().exec(tool.findCallback(success, fail))
	})
}
module.exports = {
	createTest,
	test,
	findAccount
}