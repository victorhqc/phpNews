(function(){
	"use strict";
	var MyNews = function(j){
		var d = {
			container: 'body',
			title: 'Som news',
			id:1,
			description: 'Lorem ipsum ad his scripta blandit partiendo, eum fastidii accumsan euripidis in, eum liber hendrerit an. Qui ut wisi vocibus suscipiantur, quo dicit ridens inciderint id. Quo mundi lobortis reformidans eu, legimus senserit definiebas an eos. Eu sit tincidunt incorrupte definitionem, vis mutat affert percipit cu, eirmod consectetuer signiferumque eu per. In usu latine equidem dolores',
			tags: [],
			files: [],
			path: '',
			callbacks: {
				edit: function(){},
				delete:function(){}
			}
		};

		var js = {defaults: d, data:j};
		Initclass.call(this, js);

		this.build();
		this.renderFiles();
		this.renderTags();
	};

	MyNews.prototype.build = function() {
		var container = document.querySelector(this.container);
		this.container = container;

		//Main container of the news
		this.setDOMId();
		var main = document.createElement('div');
		main.id = this.getDOMId();
		main.className = 'panel';

		//Title
		var titleContainer = document.createElement('div');
		titleContainer.className = 'panel-heading';
		this.titleContainer = titleContainer;

		var title = document.createElement('h3');
		title.className = 'panel-title';
		title.appendChild(document.createTextNode(this.title));
		this.titleDOM = title;

		var brTitle = document.createElement('br');
		title.appendChild(brTitle);
		var smallTitle = document.createElement('small');
		smallTitle.setAttribute('data-date', this.date);
		title.appendChild(smallTitle);
		titleContainer.appendChild(title);
		main.appendChild(titleContainer);

		//Description of the news
		var description = document.createElement('p');
		this.description = decodeURI(this.description);
		description.innerHTML = this.description;
		main.appendChild(description);

		//File container
		var fileContainer = document.createElement('div');
		var fileIcon = document.createElement('i');
		fileIcon.className = 'glyphicon glyphicon-file';
		var fileTitle = document.createElement('h3');
		fileTitle.appendChild(fileIcon);
		fileContainer.appendChild(fileTitle);

		var fileDiv = document.createElement('div');
		fileDiv.id = 'fn-'+this.id;
		fileDiv.className = 'row';
		fileContainer.appendChild(fileDiv);
		main.appendChild(fileContainer);
		this.fileContainer = fileDiv;

		//Tag container
		var tagDiv = document.createElement('div');
		var tagIcon = document.createElement('i');
		tagIcon.className = 'glyphicon glyphicon-tags';
		var tagTitle = document.createElement('h3');
		tagTitle.appendChild(tagIcon);
		tagDiv.appendChild(tagTitle);

		var tagContainer = document.createElement('div');
		tagContainer.id = 'tg-'+this.id;
		tagDiv.appendChild(tagContainer);
		main.appendChild(tagDiv);
		this.tagContainer = tagContainer;


		this.container.appendChild(main);
		this.main = main;

		this.callbacksFunc();
	};

	MyNews.prototype.setDOMId = function() {
		this.domID = 'nm-'+this.id;
	};

	MyNews.prototype.getDOMId = function() {
		return this.domID;
	};

	MyNews.prototype.callbacksFunc = function() {
		//Adds the callbacks function (and buttons to call them).
		
		var btngroup = document.createElement('div');
		btngroup.className = 'btn-group pull-right';
		var add = false;
		for(var c in this.callbacks){
			if(this.callbacks.hasOwnProperty(c) && typeof this.callbacks[c] === 'function'){
				var btn = document.createElement('btn');
				btn.className = 'btn btn-default';
				btn.setAttribute('data-type', c);

				var i = document.createElement('i');
				switch(c){
					case 'edit':
						i.className = 'glyphicon glyphicon-pencil';
					break;
					case 'delete':
						i.className = 'glyphicon glyphicon-trash';
					break;
					default:
					break;
				}

				add = true;

				btn.appendChild(i);
				btngroup.appendChild(btn);
				this['btn-'+c] = btn;

				btn._t = this;
				btn.addEventListener('click', function(){
					var type = this.getAttribute('data-type');
					this._t.callbacks[type](this._t, this);
				});
			}
		}

		if (add === true){
			this.titleContainer.insertBefore(btngroup, this.titleContainer.firstChild);
		}
	};

	MyNews.prototype.renderFiles = function() {
		for(var i = 0, len = this.files.length; i < len; i++){
			var file = this.files[i];
			var fd = document.createElement('div');
			fd.id = 'fi-'+file.idFile;
			fd.className = 'col-lg-3';
			this.fileContainer.appendChild(fd);
			file.container = '#'+fd.id;
			file._file = file;
			file.file = this.path+'/'+file.file;

			var f = new nFile(file);
		}
	};

	MyNews.prototype.renderTags = function() {
		var c = '#'+this.tagContainer.id;
		for(var i = 0, len = this.tags.length; i < len; i++){
			var tag = this.tags[i];
			tag.container = c;
			tag.callbacks = {};
			var t = new Tag(tag);
		}
	};

	MyNews.prototype.delete = function() {
		this.main.parentNode.removeChild(this.main);
	};

	window.News = function(j){
		return new MyNews(j);
	}
})();