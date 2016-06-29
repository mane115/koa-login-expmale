var router = require('koa-router')(),
	admin = require('../app/admin_app.js'),
	user = require('../app/user_app.js'),
	news = require('../app/news_app.js');
console.log('controller init start');
// router.post('/user/apply', user.apply);
router.post('/user/login', user.login);
router.post('/user/local', user.localTest);
// router.all("/*", tool.validate);
router.post('/user/new', user.insertData);
router.post('/user/changepw', user.changePassword);
router.get('/user/unlogin', user.unLogin);
router.post('/user/upload', user.upload);
router.get('/user/news/:site/:type', news.getNews)
router.get('/admin/test', admin.test);
router.get('/admin/find', admin.findAccount);
router.get('/test',admin.test)
module.exports = router
console.log('controller init finish')