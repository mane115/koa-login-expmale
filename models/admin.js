var mongoose = require("mongoose"),
	schema = null;
var createSchema = function() {
	var admin = {
		accountName: String,
		password: String,
		userName: String
	};
	schema = new mongoose.Schema(admin);
}
var init = function() {
	createSchema();
	mongoose.model("Admin", schema);
};
init()