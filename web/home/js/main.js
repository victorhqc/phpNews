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

	Init.prototype.deleteModal = function(news) {
		var title = App.current.language.getText('delete-title');
		var content = App.current.language.getText('delete-text');
		var jm = {
			title: title,
			subtitle: news.title,
			message: content,
			App: App,
			Init: this,
			news: news,
			idNews: news.id,
			createHelper: function(modal){
			var deleteBtn = document.createElement('button');
			deleteBtn.className = 'btn btn-danger pull-right';
			var i = document.createElement('i');
			i.className = 'glyphicon glyphicon-warning-sign';
			i.style['margin-right'] = '10px';

			var text = modal.App.current.language.getText('delete-button');
			deleteBtn.appendChild(i);
			deleteBtn.appendChild(document.createTextNode(text));

			deleteBtn.modal = modal;
			deleteBtn.addEventListener('click', function(){
				var m = this.modal;
				this.modal.Init.deleteNews(modal.idNews, modal.news, function(){
					m.hide();

					setTimeout(function(){
						m.remove()
					}, 400);
				});
			});

			modal.footer.appendChild(deleteBtn);

		}};
		var modal = new Modal(jm);

		setTimeout(function(){
			modal.show();
		}, 10);
	};

	Init.prototype.deleteNews = function(id, news, callback) {
		var j = {file:'deleteNews.php', data:{id:id}, callback:function(r){
			var ja = {type:'success'};
				ja.title = App.current.language.getText('delete-success-title');
				ja.description = App.current.language.getText('delete-success-description');

				if(r.success === false){
					ja.title = App.language.getMainText('error_title');
					ja.description = App.language.getMainText('error_desc');
					ja.type = 'danger';
				}else{
					news.delete();
				}

				new nAlert(ja);
				if(typeof callback === 'function'){
					callback();
				}
		}};
		App.current.getServer(j);
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
				news._t.deleteModal(news);
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