var dao = require('../dataBase'),
	User = dao.getModel('User'),
	tool = require('../common');
var generalFind = function(condition, limit, skip) {
	return new Promise((success, fail) => {
		User.find(condition).exec(tool.findCallback(success, fail))
	})
}
var generalCreate = function(userInfo) {
	return new Promise((success, fail) => {
		var entity = new User(userInfo);
		entity.save(tool.saveCallback(success, fail))
	})
}
var generalUpdate = function(condition, update, option) {
	return new Promise((success, fail) => {
		User.update(condition, update, option).exec(tool.updateCallback(success, fail))
	})
}
var findAccount = function(data) {
	console.log('to find data:', data)
	var condition = {
		accountName: data.accountName
	};
	return generalFind(condition)
}
var createAccount = function(applyInfo) {
	return generalCreate(applyInfo)
}
var changePassword = function(userInfo) {
	var condition = {
		accountName: userInfo.accountName
	}
	var option = {
		new: true
	}
	var update = {
		password: userInfo.newPassword
	}
	console.log('password changing')
	return generalUpdate(condition, update, option)
}
module.exports = {
	findAccount: findAccount,
	createAccount: createAccount,
	changePassword: changePassword
}