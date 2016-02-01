// hoop
var map = require('../config/map.json'),
	cheerio = require('cheerio'),
	hoopMap = map.hoop;
var getContent = function(htmlData) {
	var content = null;
	htmlData.forEach(data => {
		if (data.attribs.class == 'btn-more') {
			content = data.prev.prev.children[0].data.substring(42); //过滤大量空格
		}
	})
	return content
}
var getHoopNews = function*(acceptData, $) {
	var newsList = [];
	acceptData.forEach(data => {
		var news = {};
		news.title = data.children[0].data;
		news.href = data.attribs.href;
		var htmlData = $('a[href=\"' + news.href + '\"]')
		news.content = getContent(Array.from(htmlData))
		newsList.push(news);
	});
	return newsList
}
var initRequire = function*() {
	var url = hoopMap.hrefPath;
	var htmlData = yield tool.httpGet(url, false) //utf-8
	var $ = cheerio.load(htmlData);
	var acceptData = Array.from($(hoopMap.regular))
	var news = yield getHoopNews(acceptData, $)
	return news
}
var getNews = function*() {
	try {
		var newList = yield initRequire()
		return newList
	} catch (err) {
		throw err
	}
}
module.exports = {
	getNews
}