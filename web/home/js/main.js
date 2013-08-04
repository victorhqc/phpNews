(function(){
	"use strict";
	var Init = function(){
		var t = this;
		this.getNews(50, 0, function(r){
			t.renderNews(r.news);
		}); // Gets the last 50 news
	}

	Init.prototype.getNews = function(amount, i, callback) {
		amount = (typeof amount !== 'number') ? 50 : amount;
		i = (typeof i !== 'number') ? 0 : i;
		var j = {file:'getNews.php', data:{amount:amount, i:i}, callback:callback};
		App.current.getServer(j);
	};

	Init.prototype.renderNews = function(news) {
		var container = '#news';
		for(var i = 0, len = news.length; i < len; i++){
			var n = news[i];
			n.container = container;
			var ne = new News(n);
		}
	};

	var i = new Init();
})();