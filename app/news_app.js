var getNews = function*() {
	var client = tool.resClient(this)
	var site = this.params.site;
	var news = null;
	try {
		if (site === 'qq') {
			var qq = require('../news/qq.js');
			news = yield qq.getNews(this.params.type)
		} else if (site === 'hoop') {
			var hoop = require('../news/hoop.js');
			news = yield hoop.getNews()
		} else {
			throw 'not this site yet'
		}
		client.success(news)
	} catch (err) {
		console.log('main', err)
		client.fail(err)
	}
}

module.exports = {
	getNews
}