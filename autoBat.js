var runBat = function(batUrl, cwdUrl) {
	console.log('正在运行数据库bat文件')
	console.log('batUrl为', batUrl);
	// batUrl = '../test2.bat'; //for test
	var execFile = require('child_process').execFile;
	var option = {
		cwd: cwdUrl
	};
	return new Promise((success, fail) => {
		execFile(batUrl, null, option, (error, stdout, stderr) => {
			if (error) {
				var errMsg = 'bat文件运行错误:' + error
				fail(errMsg);
			}
		});
		var successFun = function() {
			success('bat文件运行成功')
		}
		setTimeout(successFun, 1500) //如果成功无回掉函数，且同步函数必定快于异步报错，所以设置等待时间
	})
}
module.exports = {
	runBat
}