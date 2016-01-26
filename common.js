var formidable = require('formidable'),
	ctx = require('./config.json');
var commonCallback = function(type) {
	var callback = function(success, fail) {
		var handleFun = function(e, data) {
			if (e) {
				var errorMsg = {
					type: `${type} error`,
					err: e
				}
				fail(errorMsg)
			} else {
				success(data)
			}
		}
		return handleFun
	}
	return callback
}
var resClient = function(ctx) {
	var resMsg = {}
	var success = function(data) {
		resMsg.status = 0;
		resMsg.msg = data;
		ctx.body = resMsg;
		console.log('client success');
		return Promise.resolve()
	}
	var fail = function(data) {
		resMsg.status = 9999;
		resMsg.msg = data;
		ctx.body = resMsg
		console.log('client fail')
		return Promise.resolve()
	}
	return {
		success: success,
		fail: fail
	}
}
var validate = function*(next) {
	var client = resClient(this)
	console.log('validate session:', this.session)
	if (!this.session.accountName) {
		client.fail('please login')
	} else {
		yield next
	}
}
var uploadImg = function(ctx) {
	return new Promise((success, fail) => {
		var form = new formidable.IncomingForm(),
			path = null;
		form.uploadDir = './public/img';
		form.keepExtensions = true;
		form.on('fileBegin', function(name, file) {
			path = file.path
			if (file.type !== 'image/jpeg') {
				fail('type err')
			}
			console.log('file upload begin', file.type)
		})
		form.on('file', function(name, fail) {
			console.log('file uploading')
		})
		form.on('end', function() {
			console.log('file upload end')
			success(path)
		});
		form.on('error', function(err) {
			fail(err)
		})
		form.parse(ctx.req)
	})
}
var getPhoto = function(path) {
	var newPath = path.substring(ctx.publicDir.length)
	return newPath
}
module.exports = {
	findCallback: commonCallback('find'),
	saveCallback: commonCallback('save'),
	updateCallback: commonCallback('update'),
	resClient,
	validate,
	uploadImg,
	getPhoto
}