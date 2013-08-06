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
			var d = ne.date;
			d = d.match(/([0-9]{4}\-[0-9]{2}\-[0-9]{2})/gi);
			if(d !== null){
				d = d[0];
				var query = '#'+ne.getDOMId()+' .panel-title small';
				var c = document.querySelector(query);
				if(c !== null){
					d = d.match(/([0-9]+)/gi);
					for(var k in d){
						if(d.hasOwnProperty(k)){
							d[k] = parseInt(d[k]);
						}
					}
					var month = App.language.getMainText('m-'+d[1]);
					var date = ' '+d[2]+' '+month+' '+d[0];
					c.innerHTML = date;
				}
			}
		}
	};

	var i = new Init();
})();