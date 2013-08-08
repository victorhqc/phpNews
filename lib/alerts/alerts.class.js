(function(){
	"use strict";
	var Al = function(j){
		
		var d = {
			title: 'title',
			description: 'description',
			type: 'success',
			duration: 5000, // if the value is 0 it will be forever there until closed by the button
			container: 'body',
			callback: function(){}
		};

		var js = {defaults:d, data:j};
		Initclass.call(this, js);

		this.build();
	};

	Al.prototype.build = function() {
		var el = document.createElement('div');
		el.className = 'nAlert alert alert-'+this.type;

		//Close button
		var btnClose = document.createElement('button');
		btnClose.className = 'close';
		btnClose.appendChild(document.createTextNode("\u00d7")); // <---- &times;
		btnClose._t = this;

		el.appendChild(btnClose);

		btnClose.addEventListener('click', function(){
			this._t.destroy();
			if(typeof this._t.callback === 'function'){
				this._t.callback();
			}
		});

		var row = document.createElement('div');
		row.className = 'row';

		var title = document.createElement('strong');
		title.className = 'col-lg-4';
		title.appendChild(document.createTextNode(this.title));
		row.appendChild(title);

		var desc = document.createElement('span');
		desc.className = 'col-lg-7';
		desc.appendChild(document.createTextNode(this.description));
		row.appendChild(desc);

		el.appendChild(row);

		var container = document.querySelector(this.container);
		this.container = container;
		this.container.appendChild(el);
		this.element = el;

		this.auto_destroy();
	};

	Al.prototype.auto_destroy = function() {
		var T = this;
		if(this.duration > 0){
			setTimeout(function(){
				T.destroy();
			}, this.duration);
		}
	};

	Al.prototype.destroy = function() {
		this.container.removeChild(this.element);
	};

	window.nAlert = function(j){
		return new Al(j);
	}
})();