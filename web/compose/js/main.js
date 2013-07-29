(function(){
	"use strict";
	var Init = function(){
		var I = this;
		this.gatherData(function(r){
			App.current._chosenTags = {};
			I.searchTagsFunc();
			I.displayTags(App.current._data.tags);
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

		container.appendChild(ul);
		var chosen = App.current._chosenTags;
		for(var i = 0, len = tags.length; i < len; i++){
			var tag = tags[i];
			if(!chosen.hasOwnProperty(tag.id)){
				var li = document.createElement('li');
				li.id = 't-'+i;
				li.className = 'proposed-tag';

				ul.appendChild(li);

				var j = {
					name: tag.name,
					container:'#t-'+i,
					id: tag.id,
					_i: i,
					callbacks: {
						ok: function(t){
							var i = t._i;
							var tag = tags[i];
							I.addTagToNews(tag);
						}
					}
				}
				var t = new Tag(j);
			}
		}
	};

	Init.prototype.addTagToNews = function(tag) {
		var chosen = App.current._chosenTags;
		var I = this;
		if(!chosen.hasOwnProperty(tag.id)){
			chosen[tag.id] = tag;

			var j = {
				id: tag.id,
				name: tag.name,
				container: '#chosen-tags-container',
				callbacks: {
					remove: function(t){
						I.removeTagFromNews(t);
					}
				}
			}

			new Tag(j);
			I.renderTagList(App.current._data.tags);
		}
	};

	Init.prototype.removeTagFromNews = function(tag) {
		delete App.current._chosenTags[tag.id];
		tag.remove();
		this.renderTagList(App.current._data.tags);
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

		container.appendChild(title);

		var j = {
			name: param,
			container:'#tag-list-container',
			callbacks: {
				ok: function(t){
					I.registerNewTag(param, function(r){
						I.gatherData(function(){
							I.renderTagList(App.current._data.tags);
						});
					});
				},
				remove: function(t){
					I.displayTags(App.current._data.tags);
					var input = document.getElementById('search-tags');
					input.value = '';
				}
			}
		};
		var tag = new Tag(j);
		
		App.current.translate();
	}

	Init.prototype.registerNewTag = function(tag, callback) {
		var j = {file:'registerTag.php', data:{tag:tag}, callback:callback};
		App.current.getServer(j);
	};

	//Looks up for important information like tags
	Init.prototype.gatherData = function(callback) {
		var j = {file:'mainInfo.php', data: {}, callback:function(r){
			App.current._data = r;
			if(typeof callback === 'function'){
				callback();
			}
		}};
		App.current.getServer(j);
	};

	var i = new Init();
})();