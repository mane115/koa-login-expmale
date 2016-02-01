// var ctx = require('./config.json');
var koa = require('koa'),
	app = koa(),
	fs = require('co-fs');
var tool = require('../common.js')
var getIPv4 = function() {
	console.log('正在获取ip地址');
	var os = require('os'),
		ip = null,
		IPMsg = os.networkInterfaces();
	IPMsg.WLAN.forEach(msg => {
		if (msg.family === 'IPv4') {
			ip = msg.address
		}
	})
	return Promise.resolve(ip)
}
var optenBrowser = function() {
	var child_process = require("child_process"),
		url = "http://localhost:8888";
	console.log(process.platform) //win32
	var cmd = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';
	child_process.exec(cmd + ' "' + url + '"');
	return Promise.resolve()
}
var initMidWare = function() {
	var initStaticFile = function() {
		var serve = require('koa-static'),
			options = {
				maxage: 10 * 60 * 60000
			};
		app.use(serve('.', options))
	}
	var initBodyParser = function() {
		var bodyParser = require('koa-bodyparser');
		app.use(bodyParser());
	};
	initStaticFile();
	initBodyParser()
}
var readConfig = function*(next) {
	try {
		//require的话加载成功后node保留，即是手动删除config.json的话还是提示存在
		// var oldConfig = require('./config.json'); 
		var oldConfig = yield fs.readFile('../config.json')
		console.log('config.json已存在，读取的数据为：', oldConfig.toString())
		this.body = 'json exist'
	} catch (err) {
		// console.log(err)
		if (err.errno === -4058) {
			console.log('config.json文件不存在')
			yield next
		} else {
			this.body = 'read file faild'
		}
	}
}
var createFile = function*() {
	var ctx = this.request.body.config;
	ctx.localIp = yield getIPv4();
	var parseJson = JSON.stringify(ctx)
	console.log('即将写入的数据：', parseJson)
	try {
		yield fs.writeFile('../config.json', parseJson)
		this.body = 'wirteFile success'
	} catch (err) {
		console.log('fs.write ERR:', err)
	}
}
var initRouter = function() {
	var router = require('koa-router')();
	router.post('/create', readConfig, createFile);
	app.use(router.routes())
		.use(router.allowedMethods());
}
initMidWare()
initRouter()
app.listen(8888, function() {
	console.log('listening in 8888')
	optenBrowser().then(() => console.log('open browser success'))
})