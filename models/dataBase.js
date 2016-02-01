var mongoose = require('mongoose');
var runBat = function() {
	var auto = require('../common/autoBat')
	var batUrl = ctx.dbBatUrl;
	var cwdUrl = batUrl.substring(0, 3);
	auto.runBat(batUrl, cwdUrl)
		.then(msg => console.log(msg))
		.catch(err => console.log(err))
}
var initMongoose = function() {
	mongoose.connect(`mongodb://${ctx.dbIP}/${ctx.dbName}`);
	mongoose.connection.on('error', function(err) {
		console.log('数据库可能没连接')
		console.error(err)
		if (ctx.dbIP === 'localhost') {
			runBat()
		} else {
			console.log('mongodb数据库可能无配置bat文件或非本地，请联系服务器管理员');
		}
	})
}
var loadModel = function() {
	require('../models/admin');
	require('../models/user');
}

var initDB = function() {
	initMongoose()
	loadModel()
}

var getModel = function(name) {
	return mongoose.model(name);
};

initDB()
module.exports = {
	getModel: getModel,
	connection: mongoose.connection
}