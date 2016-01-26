var koa = require('koa'),
	app = koa(),
	ctx = require('./config.json');
var initDB = function() {
	require('./dataBase');
}
var initMidWare = function() {
	var initBodyParser = function() {
		var bodyParser = require('koa-bodyparser');
		app.use(bodyParser());
	};
	var initSession = function() {
		var session = require('koa-session-store'),
			mongoStore = require('koa-session-mongo'),
			mongoose = require('./dataBase');
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
		var staticCache = require('koa-static-cache')
		app.use(staticCache(__dirname + ctx.publicDir, {
			maxAge: 24 * 60 * 60
		}))
	}
	initStaticFile();
	initSession();
	initBodyParser();
};
var initRouter = function() {
	var router = require('./controller.js')
	app
		.use(router.routes())
		.use(router.allowedMethods());
}
var initSystem = function() {
	initDB();
	initMidWare();
	initRouter();
	app.listen(ctx.port, function() {
		console.log(`koa in ${ctx.port}`)
	})
}
try {
	initSystem()
} catch (err) {
	console.log(err)
}