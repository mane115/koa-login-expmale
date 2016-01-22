var router = require('koa-router')();
var admin = require('./app/admin_app.js'),
	user = require('./app/user_app.js'),
	tool = require('./common');
console.log('controller init start')
router.post('/user/apply', user.apply);
router.post('/user/login', user.login);
router.all("/*", tool.validate);
router.post('/user/changepw', user.changePassword);
router.get('/user/unlogin', user.unLogin);
router.get('/admin/test', admin.test)
router.get('/', function*(next) {
	this.body = 'hello world'
});
module.exports = router
console.log('controller init finish')