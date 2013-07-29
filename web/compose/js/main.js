(function(){
	"use strict";
	var Init = function(){
		var I = this;
		this.gatherData(function(r){
			App.current._data = r;
			App.current._data.chosenTags = {};
			I.searchTagsFunc();
			I.displayTags(r.tags);
		});
	};

	Init.prototype.searchTagsFunc = function() {
		var input = document.getElementById('search-tags');
		
		var I = this;
		input.onkeyup = function(){
			var value = this.value;
			if(value !== ''){
				var tags = App.current._data.tags
				var searched = App.current._data._tagsSearched = [];
				for(var i = 0, len = tags.length; i < len; i++){
					var tag = tags[i];
					var re = new RegExp(value, 'gi');
					if(tag.name.match(re) !== null){
						searched.push(tag);
					}
				}

				I.displayTags(searched, value);
			}else{
				I.displayTags(App.current._data.tags);
			}
		}
	};

	Init.prototype.displayTags = function(tags, searchvalue){
		if(tags.length === 0 && typeof searchvalue !== 'undefined'){
			this.addTagDOM(searchvalue);
		}else{
			this.renderTagList(tags);
		}
	}

	Init.prototype.renderTagList = function(tags) {
		var I = this;
		var container = document.getElementById('tag-list-container');
		container.innerHTML = '';

		var ul = document.createElement('ul');
		ul.className = 'nav bs-sidenav';
		ul.id = 'tags-available';

		var chosen = App.current._data.chosenTags;
		for(var i = 0, len = tags.length; i < len; i++){
			var tag = tags[i];
			if(!chosen.hasOwnProperty(tag.id)){
				var li = document.createElement('li');

				var btn = document.createElement('button');
				btn.className = 'btn btn-success';
				btn.setAttribute('data-id', tag.id);
				btn.setAttribute('data-i', i);

				var text = document.createElement('span');
				text.appendChild(document.createTextNode(tag.name));

				var icon = document.createElement('i');
				icon.className = 'glyphicon glyphicon-tag';

				btn.appendChild(icon);
				btn.appendChild(text);

				li.appendChild(btn);
				ul.appendChild(li);

				btn.addEventListener('click', function(){
					var i = this.getAttribute('data-i');
					var tag = tags[i];
					I.addTagToNews(tag);
				});
			}
		}

		container.appendChild(ul);
	};

	Init.prototype.addTagToNews = function(tag) {
		var chosen = App.current._data.chosenTags;
		if(!chosen.hasOwnProperty(tag.id)){
			chosen[tag.id] = tag;
		}
	};

	Init.prototype.addTagDOM = function(param){
		var I = this;

		var container = document.getElementById('tag-list-container');
		container.innerHTML = '';
		var title = document.createElement('h4');

		var titleText = document.createElement('span');
		titleText.setAttribute('data-ltag', 'new-tag-title');

		var titleDesc = document.createElement('small');
		titleDesc.setAttribute('data-ltag', 'new-tag-description');

		var br = document.createElement('br');

		title.appendChild(titleText);
		title.appendChild(br);
		title.appendChild(titleDesc);

		var tag = document.createElement('div');
		tag.className = 'pull-left label-tag label label-success';

		var icon = document.createElement('i');
		icon.className = 'glyphicon glyphicon-tag';
		var text = document.createElement('span');
		text.appendChild(document.createTextNode(param));

		tag.appendChild(icon);
		tag.appendChild(text);

		container.appendChild(title);
		container.appendChild(tag);

		var fixer = document.createElement('div');
		fixer.className = 'clearfix';
		container.appendChild(fixer);

		var btncontainer = document.createElement('div');
		btncontainer.className = 'btn-group';
		btncontainer.id = 'btns-new-tag';

		var btnok = document.createElement('button');
		btnok.className = 'btn';
		btnok.setAttribute('data-ltag', 'new-tag-ok');

		var btncancel = document.createElement('button');
		btncancel.className = 'btn btn-danger';
		btncancel.setAttribute('data-ltag', 'new-tag-cancel');

		btncontainer.appendChild(btnok);
		btncontainer.appendChild(btncancel);
		container.appendChild(btncontainer);

		btnok.addEventListener('click', function(){
			I.registerNewTag(param, function(r){
				console.log('r', r);
			});
		});

		btncancel.addEventListener('click', function(){
			I.displayTags(App.current._data.tags);
			var input = document.getElementById('search-tags');
			input.value = '';
		});
		
		App.current.translate();
	}

	Init.prototype.registerNewTag = function(tag, callback) {
		var j = {file:'registerTag.php', data:{tag:tag}, callback:callback};
		App.current.getServer(j);
	};

	//Looks up for important information like tags
	Init.prototype.gatherData = function(callback) {
		var j = {file:'mainInfo.php', data: {}, callback:callback};
		App.current.getServer(j);
	};

	var i = new Init();
})();