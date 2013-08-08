(function(){
	"use strict";
	var Init = function(){
		var t = this;

		this.domFuncions();
		this.getNews(50, 0, function(r){
			t.renderNews(r.news);
		}); // Gets the last 50 news
	}

	//The functionality for the dom is set
	Init.prototype.domFuncions = function() {
		this.searchFunc();
	};

	Init.prototype.searchFunc = function() {
		var frm = document.getElementById('search-form');
		frm._this = this;
		frm.addEventListener('submit', function(e){
			var b = document.getElementById('regular-search')
			b.setAttribute('disabled', 'disabled');
			if(e.preventDefault){
				e.preventDefault();
			}
			e.returnValue = false;

			var p = document.getElementById('search-parameter').value;
			var t = this._this;
			if(p !== ''){
				this._this.searchNews(p, 50, 0, function(r){
					var b = document.getElementById('regular-search')
					b.removeAttribute('disabled');
					t.renderNews(r.news);
				});
			}else{
				this._this.getNews(50, 0, function(r){
					t.renderNews(r.news);
				});
			}
		});
	};

	Init.prototype.searchNews = function(parameter, amount, i, callback) {
		amount = (typeof amount !== 'number') ? 50 : amount;
		i = (typeof i !== 'number') ? 0 : i;
		var j = {file:'searchNews.php', data:{amount:amount, i:i, search:parameter}, callback:callback};
		App.current.getServer(j);
	};

	Init.prototype.getNews = function(amount, i, callback) {
		amount = (typeof amount !== 'number') ? 50 : amount;
		i = (typeof i !== 'number') ? 0 : i;
		var j = {file:'getNews.php', data:{amount:amount, i:i}, callback:callback};
		App.current.getServer(j);
	};

	Init.prototype.deleteModal = function() {
		var jm = {createHelper: function(modal){
			var dynamicContent = document.createElement('div');
			dynamicContent.id = 'dynamo';
			modal.body.appendChild(dynamicContent);
		}};
		var modal = new Modal(jm);
		modal.show();
	};

	Init.prototype.renderNews = function(news) {
		var container = document.getElementById('news');
		container.innerHTML = '';
		for(var i = 0, len = news.length; i < len; i++){
			var n = news[i];
			n.container = '#'+container.id;
			n.callbacks = {};
			n._t = this;
			n.callbacks.delete = function(news, btn){
				news._t.deleteModal();
			};

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