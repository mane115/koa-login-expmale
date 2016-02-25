var mongoose = require("mongoose"),
	schema = null;
var createSchema = function() {
	var user = {
		accountName: String,
		password: String,
		userName: String,
		avatar: String,
		x: Number,
		y: Number
	};
	schema = new mongoose.Schema(user);
}
var init = function() {
	createSchema();
	mongoose.model("User", schema);
};
init()