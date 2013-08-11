(function(){
	"use strict";
	var Init = function(){
		var t = this;

		this.domFuncions();
		this.amount = 5;
		this.i = 0;
		this.getNews(this.amount, this.i, function(r){
			t.renderNews(r.news, t.amount, t.i, r.total);
		}); // Gets the last 15 news
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
				this._this.searchNews(p, this.amount, this.i, function(r){
					var b = document.getElementById('regular-search')
					b.removeAttribute('disabled');
					t.renderNews(r.news);
				});
			}else{
				this._this.getNews(this.amount, this.i, function(r){
					t.renderNews(r.news, t.amount, t.i, r.total);
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

	Init.prototype.renderNews = function(news, amount, j, total) {
		var container = document.getElementById('news');
		this.newsContainer = container;
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

		//After all the news are rendered, the pagination is set.
		if(amount !== undefined && j !== undefined && total !== undefined){
			this.pagination(total, amount, j);
		}
	};

	Init.prototype.pagination = function(total, amount, i) {
		var oldPagination = document.getElementById('news-pagination');
		if(oldPagination !== null){
			oldPagination.parentNode.removeChild(oldPagination);
		}

		var ul = document.createElement('ul');
		ul.className = 'pagination';

		//Calculate the number of pages
		var pags = Math.ceil(total / amount);

		var maxPags = 20;

		for(var j = 0; j < pags && j < maxPags; j++){
			var li = document.createElement('li');
			console.log(i, j);
			if(i === j){
				li.className = 'active';
			}
			var a = document.createElement('a');
			var n = j + (i * amount);
			var num = document.createTextNode(j + 1);
			a.appendChild(num);
			a.href = '';
			a._i = j;
			a._amount = amount;
			a._t = this;

			li.appendChild(a);
			ul.appendChild(li);

			a.addEventListener('click', function(){
				var amount = this._amount;
				var i = this._i;
				var t = this._t
				this._t.getNews(amount, i, function(r){
					t.renderNews(r.news, amount, i, r.total);
				});
			});
		}

		this.newsContainer.appendChild(ul);
	};

	var i = new Init();
})();