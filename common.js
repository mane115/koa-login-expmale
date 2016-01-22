var findCallback = function(success, fail) {
	var handleFun = function(e, data) {
		if (e) {
			fail('find err')
		} else {
			success(data)
		}
	}
	return handleFun
}

var saveCallback = function(success, fail) {
	var handleFun = function(e, data) {
		if (e) {
			fail('save err')
		} else {
			success(data)
		}
	}
	return handleFun
}

var updateCallback = function(success, fail) {
	var handleFun = function(e, data) {
		if (e) {
			fail('update err')
		} else {
			success(data)
		}
	}
	return handleFun
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
var test = function(ctx, msg) {
	ctx.body = msg
}
var validate = function*(next) {
	var client = resClient(this)
	console.log('validate session:', this.session)
	if (!this.session) {
		client.fail('please login')
	} else {
		yield next
	}
}
module.exports = {
	findCallback: findCallback,
	saveCallback: saveCallback,
	updateCallback: updateCallback,
	resClient: resClient,
	test: test,
	validate: validate
}