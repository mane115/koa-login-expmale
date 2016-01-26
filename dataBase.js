var mongoose = require('mongoose');
var ctx = require('./config.json');
var initMongoose = function() {
	mongoose.connect(`mongodb://${ctx.dbIP}/${ctx.dbName}`);
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