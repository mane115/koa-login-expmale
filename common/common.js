var formidable = require('formidable'),
	fs = require('fs'),
	http = require('http'),
	gbk = require('gbk');

var commonCallback = function(type) {
	var callback = function(success, fail) {
		var handleFun = function(e, data) {
			console.log('callback')
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
		resMsg.msg = data.toString();
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
var compairIPv4 = function(newIP) {
	if (ctx.localIp !== newIP) {
		console.log(`compairing IP:${ctx.localIp} and ${newIP}`)
		var update = {
			localIp: newIP
		}
		return updateConfig(ctx, update)
	} else {
		return Promise.resolve('IPv4 not change')
	}
}
var updateConfig = function(ctx, update) {
	for (attr in update) {
		ctx[attr] = update[attr]
	}
	var newContent = JSON.stringify(ctx);
	console.log('即将更新config.json,更新的内容为：', newContent)
	fs.writeFileSync('../config/config.json', newContent);
	return '文件更新成功'
}
var checkIPv4 = function() {
	getIPv4()
		.then(compairIPv4)
		.then(msg => console.log(msg))
		.catch(err => console.log(err))
}
var httpGet = function(path, bol) {
	//bol用于指名是否为gbk,默认bol=false.
	return new Promise((success, fail) => {
		http.get(path, function(res) {
			if (!bol) res.setEncoding('utf8'); //操蛋的字符转换
			console.log('请求的地址：', path)
			var data = '';
			res.on('data', function(chunk) {
				if (bol) {
					var utf8 = gbk.toString('utf-8', chunk)
					data += utf8
				} else {
					data += chunk
				}
			})
			res.on('end', function() {
				success(data)
			})
			res.on('error', function(err) {
				fail(err)
			})
		})
	})
}
module.exports = {
	findCallback: commonCallback('find'),
	saveCallback: commonCallback('save'),
	updateCallback: commonCallback('update'),
	resClient,
	validate,
	uploadImg,
	getPhoto,
	checkIPv4,
	httpGet
}