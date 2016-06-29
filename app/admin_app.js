var dao = require('../dao/admin_dao.js');

var test = function*(next) {
	var client = tool.resClient(this)
	var url = 'http://03kh.com';
	var data = yield tool.httpGet(url,true);
	yield client.success(data)
}
var test2 = function*(val, req) {
	yield dao.test(val) //7 need val
	console.log('dao.test end')
	req.body = 'hello'
}
var test3 = function*() {
	console.log('here is test3') //3
	this.body = 'hello'; //4
	console.log('test 3 end') //5
}
var findAccount = function*() {
	var client = tool.resClient(this)
	console.log('admin find')
	var data = yield dao.findAccount();
	var path = data[0].avatar;
	console.log(path);
	// var newPath = tool.getPhoto(path)
	yield client.success(data)
}
module.exports = {
	test,
	test2,
	test3,
	findAccount
}