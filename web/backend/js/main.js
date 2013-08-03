(function(){
	"use strict";
	var Init = function(){
		this.buildMenu();

		this.startModule('home');
	}

	Init.prototype.buildMenu = function(force) {
		var data = App._data.mainmenu;
		var menu = document.getElementById('main-menu');
		if(menu.childNodes.length <= 1 || force === true){
			for(var k in data){
				if(data.hasOwnProperty(k)){
					var li = document.createElement('li');
					li.setAttribute('data-module', k);
					var a = document.createElement('a');
					a.href = '#';
					a._this = this;

					var i = document.createElement('i');
					i.className = 'menu-icon '+data[k].icon;
					a.appendChild(i);

					var span = document.createElement('span');
					span.setAttribute('data-ltag', k);
					a.appendChild(span);

					li.appendChild(a);
					menu.appendChild(li);

					a.addEventListener('click', function(){
						var n = this.parentNode.getAttribute('data-module');
						this._this.startModule(n);
					});
				}
			}

			App.current.translate();
		}
	};

	Init.prototype.startModule = function(name) {
		//Remove the active class in the li's of the menu
		var elms = document.querySelectorAll('#main-menu > li');
		for(var i = 0, len = elms.length; i < len; i++){
			var el = elms[i];
			if(el.getAttribute('data-module') !== name){
				el.className = '';
			}else{
				el.className = 'active';
			}
		}

		if(App._div === undefined){
			App._div = App.div;
		}
		App.div = '#main-content';
		App.getModule(name);
		App.current.start();
	};

	var i = new Init();
})();