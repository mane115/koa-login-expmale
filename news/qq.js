var	map = require('../common/map.json'),
	cheerio = require('cheerio'),
	qqMap = map.qq;
var getImgSrc = function(newsInfo) {
	var imgs = []
	newsInfo.forEach(data => {
		if (data.attribs && data.attribs.class === 'pic') {
			imgs.push(data.children[0].attribs.src)
		}
	})
	return imgs
}

var getQQNews = function*(requireData, $) {
	console.log('news')
	var newsList = []
	requireData.forEach(data => {
		if (data.children && typeof data.children !== 'function') {
			var title = data.children[0].data;
			var href = data.attribs.href;
			//按照十句话新闻的需求来说这里已经满足了
			var newsMsg = {
				title: title,
				href: qqMap.hrefPath + href
			}
			var newsHtmlInfo = Array.from($('a[href=\"' + href + '\"]'))
				//额外获取新闻相关图片
			var imgs = getImgSrc(newsHtmlInfo)
			if (imgs.length !== 0) {
				newsMsg.imgs = imgs
			}
			newsList.push(newsMsg)
		}
	})
	return newsList
}

var initRequire = function*(type) {
	var url = qqMap.hrefPath + qqMap.type[type] + '.shtml'
	var htmlData = yield tool.httpGet(url, true) //true代表为gbk为charset的网页
	var $ = cheerio.load(htmlData);
	var requireData = Array.from($(qqMap.regular))
	var newsList = yield getQQNews(requireData, $)
	return newsList
};

var setType = function(type) {
	switch (type) {
		case '1':
			return 'china'
			break
		case '2':
			return 'world'
			break
		case '3':
			return 'society'
			break
		default:
			throw 'error type,qq for 1 to 3'
			break
	}
}

var getNews = function*(type) {
	try {
		var newtype = setType(type)
		var newList = yield initRequire(newtype)
		return newList
	} catch (err) {
		throw err
	}
}

module.exports = {
	getNews
}