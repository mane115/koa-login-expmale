var dao = require('../dao/admin_dao.js')
var test = function*(next) {
	console.log('before dao') //1
	var val = yield dao.createTest() //2 return val
	console.log('after dao') //3
	yield * test2(val, this)
	console.log('after test2'); //6
	// yield next
	// console.log('after next')
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
module.exports = {
	test: test,
	test2: test2,
	test3: test3
}