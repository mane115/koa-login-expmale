var runBat = function(batUrl, cwdUrl) {
	console.log('正在运行数据库bat文件')
	console.log('batUrl为', batUrl)
	var execFile = require('child_process').execFile;
	var option = {
		cwd: cwdUrl
	};
	execFile(batUrl, null, option, (error, stdout, stderr) => {
		if (error) {
			var errMsg = 'bat文件运行错误:' + error
			throw errMsg;
		}
	});
	console.log('数据库运行成功')
}
module.exports = {
	runBat
}