var tool = require('../common.js'),
	qq = require('../news/qq.js');

var getNews = function*() {
	var client = tool.resClient(this)
	try {
		if (this.params.site === 'qq') {
			var news = yield qq.getNews(this.params.type, client)
			client.success(news)
		} else {
			throw 'not this site yet'
		}
	} catch (err) {
		console.log('main', err)
		client.fail(err)
	}
}

module.exports = {
	getNews
}