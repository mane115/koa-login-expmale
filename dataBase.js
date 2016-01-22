var mongoose = require('mongoose');
var initMongoose = function() {
	mongoose.connect('mongodb://localhost/koa_borrow');
	mongoose.connection.on('error', function(err) {
		console.log(err)
	})
}
var loadModel = function() {
	require('./models/admin');
	require('./models/user');
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