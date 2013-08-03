(function(){
	"use strict";
	var Init = function(){
		var I = this;
		this.gatherData(function(){
			App.current._chosenTags = {};
			App.current._files = {};

			I.addFilesTrigger();
			I.submitFunc();

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

	Init.prototype.addFilesTrigger = function() {
		//Unfortunetly the file input cannot be styled, so I thought a nice solution for the css-dilema :)
		var btn = document.getElementById('false-file-button');

		var I = this;
		btn.addEventListener('click', function(e){
			var inpf = document.getElementById('fileselect');
			inpf.click();

			if(e.preventDefault){
				e.preventDefault();
			}
			e.returnValue = false;
		});

		var inpf = document.getElementById('fileselect');
		inpf.addEventListener('change', function(){
			if(I.validateSize()){
				I.renderFiles();
			}
		});

	};

	//The max upload file must be checked with the obtained files
	Init.prototype.validateSize = function(){
		var input = document.getElementById('fileselect');
		if(typeof input.files !== 'undefined'){
			var files = input.files;
			var size = 0;
			for(var k in files){
				var file = files[k];
				if(files.hasOwnProperty(k) && (typeof file.size === 'number')){
					size = size + file.size;
				}
			}

			//The current size is in bytes, megabytes format is needed.
			size = size / 1024; // Kb
			size = size / 1024; // Mb
		}

		var max = App.current._data.maxUpload;
		max = max.match(/([0-9]+)/gi);
		max = parseInt(max);
		console.log(size, '>', max);
		return (size > max) ? false : true;
	}

	Init.prototype.renderFiles = function(){
		var input = document.getElementById('fileselect');
		var I = this;
		if(typeof input.files !== 'undefined'){
			var files = input.files;
			
			var ul = document.getElementById('chosen-files');
			for(var i = 0, len = files.length; i < len; i++){
				var f = files[i];
				var reader = new FileReader();
				reader._file = f;
				reader._i = i;
				reader.onload = function(e){
					var f = {name: e.target._file.name, file:e.target.result};
					App.current._files[e.target._i] = f;
				};
				reader.readAsDataURL(f);

				var li = document.createElement('li');
				li.id = 'li-f-'+i;
				li.className = 'chosen-file';
				ul.appendChild(li);

			 	var jt = {
					id: i,
					name: f.name,
					container: '#li-f-'+i,
					className: 'label label-info',
					file: f,
					callbacks: {
						remove: function(t){
							I.removeFile(t);
						}
					}
				}

				new Tag(jt);
			}
		}
	}

	Init.prototype.removeFile = function(t){
		var files = App.current._files;
		for(var f in files){
			if(files.hasOwnProperty(f)){
				if(t.id === parseInt(f)){
					t.remove();
					delete App.current._files[f];
					break;
				}
			}
		}
	}

	Init.prototype.submitFunc = function() {
		var I = this;
		var btn = document.getElementById('compose-form');
		btn.addEventListener('submit', function(e){
			if(e.preventDefault){
				e.preventDefault();
			}
			e.returnValue = false;

			var data = I.gatherComposeData();
			I.sendData(data, function(){});
		}, false);
	};

	Init.prototype.sendData = function(data, callback){
		App.current.getServer('composeNew.php', data, callback);
	}

	Init.prototype.gatherComposeData = function() {
		var inps = document.querySelectorAll('#compose-form .form-control');

		var values = {};
		for(var i = 0, len = inps.length; i < len; i++){
			var inp = inps[i];

			values[inp.name] = inp.value;
		}

		//Tags
		values.tags = App.current._chosenTags;

		//Files
		values.files = App.current._files;

		return values;
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

	//Thanks for sharing this code!
	//http://jehiah.cz/a/firing-javascript-events-properly
	function fireEvent(element,event) {
		if (document.createEvent) {
			// dispatch for firefox + others
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(event, true, true ); // event type,bubbling,cancelable
			return !element.dispatchEvent(evt);
		} else {
			// dispatch for IE
			var evt = document.createEventObject();
		return element.fireEvent('on'+event,evt)
	}
}

	var i = new Init();
})();