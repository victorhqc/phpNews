(function(){
	"use strict";
	var Init = function(){
		this.buildMenu();
	}

	Init.prototype.buildMenu = function() {
		var data = App._data.mainmenu;
		console.log('data', data);
		var menu = document.getElementById('main-menu');
		for(var k in data){
			if(data.hasOwnProperty(k)){
				var li = document.createElement('li');
				var a = document.createElement('a');
				a.href = '#';
				a.setAttribute('data-ltag', k);
				li.appendChild(a);
				menu.appendChild(li);
			}
		}

		App.current.translate();
	};

	var i = new Init();
})();