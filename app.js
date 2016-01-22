var koa = require('koa'),
	app = koa(),
	router = require('koa-router')();
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
		app.keys = ['Gho is so handsome'];
		var store = mongoStore.create({
			mongoose: mongoose.connection,
			expirationTime: 36000
		})
		app.use(session({
			store: store
		}));
	}
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
	initRouter()
	app.listen(3000, function() {
		console.log('koa in 3000')
	})
}
initSystem()