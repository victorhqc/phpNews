(function(){
	"use strict";
	var TagClass = function(j){
		var defaults = {
			id: 1,
			name: 'Tag',
			container: 'body',
			className: 'label label-success',
			callbacks: {
				ok: function(t){
					console.log(t);
				},
				remove: function(t){
					console.log(t);
				}
			}
		};

		var js = {defaults:defaults, data:j};
		Initclass.call(this, js);

		this.build();
	};

	TagClass.prototype.build = function() {
		var container = document.querySelector(this.container);

		var group = document.createElement('div');
		group.className = 'tag '+this.className;

		var main = document.createElement('span');
		main.className = 'main-tag';
		main.appendChild(document.createTextNode(this.name));

		group.appendChild(main);
		for(var c in this.callbacks){
			if(this.callbacks.hasOwnProperty(c)){
				var i = '';
				switch(c){
					case 'ok':
						i = 'glyphicon glyphicon-ok';
					break;
					case 'remove':
						i = 'glyphicon glyphicon-remove';
					break;
				}

				var icon = document.createElement('i');
				icon.className = i;
				icon.setAttribute('data-callback', c);

				group.appendChild(icon);

				var T = this;
				icon.addEventListener('click', function(){
					var c = this.getAttribute('data-callback');
					if(typeof T.callbacks[c] === 'function'){
						T.callbacks[c](T);
					}
				});
			}
		}

		container.appendChild(group);
		this.element = group
	};

	TagClass.prototype.remove = function() {
		this.element.parentNode.removeChild(this.element);
	};

	window.Tag = function(j){
		return new TagClass(j);
	}
})();