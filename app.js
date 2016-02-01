var koa = require('koa'),
	app = koa();
global.ctx = require('./config/config.json');
global.tool = require('./common/common.js');
var initDB = function() {
	require('./models/dataBase');
}
var initMidWare = function() {
	var initBodyParser = function() {
		var bodyParser = require('koa-bodyparser');
		app.use(bodyParser());
	};
	var initSession = function() {
		var session = require('koa-session-store'),
			mongoStore = require('koa-session-mongo'),
			mongoose = require('./models/dataBase');
		app.keys = ctx.keys;
		var store = mongoStore.create({
			mongoose: mongoose.connection,
			expirationTime: 36000
		})
		app.use(session({
			store: store
		}));
	}
	var initStaticFile = function() {
		var serve = require('koa-static'),
			dir = __dirname + ctx.publicDir,
			options = {
				maxage: 10 * 60 * 60000
			};
		app.use(serve(dir, options))
	}
	initStaticFile();
	initSession();
	initBodyParser();
};

var initRouter = function() {
	var router = require('./router/controller.js')
		// var router = require('./controller.js')
	app.use(router.routes())
		.use(router.allowedMethods());
}

var initSystem = function() {
	initDB();
	initMidWare();
	initRouter();
	tool.checkIPv4();
	app.listen(ctx.port);
	console.log(`koa in ${ctx.port}`)
}
try {
	initSystem()
} catch (err) {
	console.log(err)
}